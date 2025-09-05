import { fastify } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import routes from "./connect.js";

const PORT = 3001;

async function main() {
  const server = fastify();

  await server.register(fastifyConnectPlugin, { routes });

  server.get("/", (_, reply) => {
    reply.type("text/plain");
    reply.send("ConnectRPC server is running!");
  });

  server.listen({ port: PORT, host: '127.0.0.1' }, (err, address) => { // Add host: '127.0.0.1'
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 ConnectRPC server running at ${address}`);
  });
}

main();
