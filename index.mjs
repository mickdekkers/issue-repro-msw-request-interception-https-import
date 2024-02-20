import { setupServer } from "msw/node";
import { once } from "node:events";

// This works: request is correctly intercepted by MSW
// import https from "node:https";
// This does not work: request is not intercepted by MSW
import * as https from "node:https";

async function test() {
  const mswServer = setupServer();
  mswServer.listen({ onUnhandledRequest: "error" });
  mswServer.events.on("request:start", ({ request }) => {
    console.log("Outgoing:", request.method, request.url);
  });

  const url = new URL("https://example.org");

  let req;
  try {
    req = https.get(url);
    const [res] = await once(req, "response");

    // This should not be reached
    throw new Error(
      `Request should have been intercepted by MSW, but instead received response: ${res.statusCode} ${res.statusMessage}`
    );
  } catch (err) {
    if (err.message.startsWith("Request should")) {
      throw err;
    }

    // MSW should have intercepted the request
    if (!err.message.startsWith("[MSW] Cannot bypass a request")) {
      throw err;
    }
  } finally {
    req?.destroy();
  }

  console.log("PASSED");

  mswServer.resetHandlers();
  mswServer.close();
}

test().catch((err) => {
  console.error(err);
  console.error("FAILED");
  process.exit(1);
});
