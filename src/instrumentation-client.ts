import { initBotId } from "botid/client/core";

// Vercel BotID — client-side challenge instrumentation. Declares which requests
// get the BotID headers attached so checkBotId() can classify them server-side.
// Must list every route that calls checkBotId(). Inert in local dev (always
// isBot:false); active on Vercel deployments.
initBotId({
  protect: [
    { path: "/api/contact", method: "POST" },
    { path: "/api/inquiries", method: "POST" },
  ],
});
