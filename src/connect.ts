import { ConnectRouter } from "@connectrpc/connect";
import { chromium } from "playwright";
import { create } from "@bufbuild/protobuf";
import { CryptoService } from "../gen/crypto/v1/crypto_pb.js";
import {
  GetCryptoByNameRequest,
  GetCryptoByNameResponse,
  ListCryptosRequest,
  ListCryptosResponse,
  CryptoSchema,
  ListCryptosResponseSchema, 
  GetCryptoByNameResponseSchema,
} from "../gen/crypto/v1/crypto_pb.js";

async function scrapeCryptos(): Promise<{ name: string; price: string }[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto("https://www.tradingview.com/markets/cryptocurrencies/prices-all/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.waitForSelector("table tbody tr");

    const allCryptos = await page.evaluate(() => {
      const data: { name: string; price: string }[] = [];
      const rows = document.querySelectorAll("table tbody tr");

      rows.forEach((row) => {
        const nameLink =
          (row.querySelector("td:nth-child(1) a") as HTMLElement) ||
          (row.querySelector('a[href^="/symbols/"]') as HTMLElement);

        const priceCell =
          (row.querySelector("td:nth-child(3)") as HTMLElement) ||
          (row.querySelector('td[data-field="close"]') as HTMLElement) ||
          (row.querySelector("td") as HTMLElement);

        if (nameLink && priceCell) {
          const name = (nameLink.innerText || "").trim();
          const rawPrice = (priceCell.innerText || "").trim();
          const price = /USD/i.test(rawPrice) ? rawPrice : `${rawPrice} USD`;
          if (name && /\d/.test(price)) {
            data.push({ name, price });
          }
        }
      });
      return data;
    });
    return allCryptos;
  } finally {
    await browser.close();
  }
}

export default (router: ConnectRouter) => {
  router.service(CryptoService, {
    async listCryptos(req: ListCryptosRequest): Promise<ListCryptosResponse> {
      try {
        const cryptos = await scrapeCryptos();
        const queryName = req.nameFilter?.trim().toLowerCase() || "";

        const filteredCryptos = queryName
          ? cryptos.filter((c) => c.name.toLowerCase().includes(queryName))
          : cryptos;

        // Construct the response message using create()
        return create(ListCryptosResponseSchema, {
          cryptos: filteredCryptos.map((c) => create(CryptoSchema, c)),
        });
      } catch (err) {
        console.error("Error scraping cryptos:", err);
        throw { code: "internal", message: "Failed to fetch crypto data." };
      }
    },

    async getCryptoByName(req: GetCryptoByNameRequest): Promise<GetCryptoByNameResponse> {
      try {
        const cryptos = await scrapeCryptos();
        const queryName = req.name?.trim().toLowerCase() || "";

        if (!queryName) {
          throw { code: "invalid_argument", message: "Name is required" };
        }

        const match = cryptos.find((c) => c.name.toLowerCase().includes(queryName));

        if (!match) {
          throw { code: "not_found", message: `No cryptocurrency matching "${req.name}"` };
        }

        // Construct the response message using create()
        return create(GetCryptoByNameResponseSchema, {
          crypto: create(CryptoSchema, match),
        });
      } catch (err) {
        console.error("Error scraping cryptos:", err);
        throw { code: "internal", message: "Failed to fetch crypto data." };
      }
    },
  });
};
