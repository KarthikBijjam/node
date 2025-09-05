
const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = 3001;

// GET /api/v1/cryptos?name=virtual
app.get('/api/v1/cryptos', async (req, res) => {
  const queryName = (req.query.name || '').trim().toLowerCase();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.tradingview.com/markets/cryptocurrencies/prices-all/', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    await page.waitForSelector('table tbody tr');

    // Extract all { name, price } then we'll filter by ?name=
    const allCryptos = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      const data = [];

      rows.forEach(row => {
        // Prefer the <a> with the coin name (no ticker)
        const nameLink =
          row.querySelector('td:nth-child(1) a') ||
          row.querySelector('a[href^="/symbols/"]');

        // Price cell (as seen in this layout)
        const priceCell =
          row.querySelector('td:nth-child(3)') ||
          row.querySelector('td[data-field="close"]') ||
          row.querySelector('td');

        if (nameLink && priceCell) {
          const name = (nameLink.innerText || '').trim();
          const rawPrice = (priceCell.innerText || '').trim();
          const price = /USD/i.test(rawPrice) ? rawPrice : `${rawPrice} USD`;

          if (name && /\d/.test(price)) {
            data.push({ name, price });
          }
        }
      });

      return data;
    });

    if (!allCryptos.length) {
      return res.status(500).json({
        status: 'error',
        message: 'No crypto rows found. Page layout may have changed.',
      });
    }

    // If ?name= provided, filter by it (case-insensitive substring match)
    if (queryName) {
      const match = allCryptos.find(c =>
        c.name.toLowerCase().includes(queryName)
      );

      if (!match) {
        return res.status(404).json({
          status: 'fail',
          message: `No cryptocurrency matching "${req.query.name}"`,
        });
      }

      return res.status(200).json({
        status: 'success',
        data: match, // single object { name, price }
      });
    }

    // No filter: return all
    res.status(200).json({
      status: 'success',
      results: allCryptos.length,
      data: allCryptos,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});