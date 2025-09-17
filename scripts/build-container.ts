import configs from '../configs';
import path from 'path';
import fs from 'fs';
import { spawn } from "child_process";

const port = configs?.backend?.database?.port;
const isValid = Number.isInteger(port) && port >= 1 && port <= 65535;

if (!isValid) {
    throw new Error('Database port number is either missing or invalid');
}
const filePath = path.join(process.cwd(), 'docker-compose.yml');

async function createFile() {
    const t = '  ';
    const lines = [
        'services:',
        `${t}postgres:`,
        `${t}${t}image: postgres`,
        `${t}${t}ports:`,
        `${t}${t}${t}- '${port}:${port}'`,
        `${t}${t}env_file:`,
        `${t}${t}${t}- backend/.env`,
        `${t}${t}volumes:`,
        `${t}${t}${t}- 'postgres:/var/lib/postgresql/data'`,
        '',
        'volumes:',
        `${t}postgres:`
    ];

    const content = lines.join('\n');
    await fs.promises.writeFile(filePath, content, { encoding: 'utf8' });
}

async function up() {
    const child = spawn("docker", ["compose", "up", "-d"], {
        stdio: "inherit", // pipe stdout/stderr directly
        shell: true       // required on Windows
    });

    return new Promise<number | null>((resolve, reject) => {
        child.on("close", (code) => {
            console.log(`docker compose exited with code ${code}`);
            resolve(code);
        });
    })
}

async function cleanup() {
    if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
    }
}

await createFile();
await up();
await cleanup();