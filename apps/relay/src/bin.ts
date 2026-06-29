import { bootstrap } from "./server";

const start = async () => {
    try {
        const app = await bootstrap();

        await app?.listen({ port: 8089, host: '0.0.0.0' });

        console.log(`Server listening at ${app?.server.address()}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
