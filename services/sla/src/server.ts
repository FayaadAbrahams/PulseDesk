import {buildApp} from "./app.js";

const app = buildApp({logger: true});

const port = Number(process.env.PORT ?? 3001);
const host = "0.0.0.0";

try {
    await app.listen({port, host});
} catch (err) {
    app.log.error(err);
    process.exit(1);
}

process.on("SIGTERM", async () => {
    app.log.info("SIGTERM received, shutting down");
    await app.close();
    process.exit(0);
});