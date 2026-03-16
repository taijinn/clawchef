import { startWebLoginWithQr } from '/Users/taijin/openclaw-workspace/openclaw/dist/web/login-qr.js';
import { loadConfig } from '/Users/taijin/openclaw-workspace/openclaw/dist/config/config.js';

async function main() {
    process.env.OPENCLAW_CONFIG = '/tmp/dummy-config.json';
    try {
        const result = await startWebLoginWithQr({ timeoutMs: 15000, force: true });
        console.log("RESULT:::" + JSON.stringify(result));
    } catch (e) {
        console.error("ERROR:::" + e.message);
    }
    process.exit(0);
}

main();
