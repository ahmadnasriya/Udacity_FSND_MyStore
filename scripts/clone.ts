import { spawn } from "child_process";
import fs from 'fs';
import path from 'path';

function clean() {
    const bep = path.join(process.cwd(), 'backend');
    const fep = path.join(process.cwd(), 'frontend');
    
    return Promise.all([
        fs.promises.rm(bep, { recursive: true, force: true }),
        fs.promises.rm(fep, { recursive: true, force: true }),
    ]);
}

function clone(repoName: string, target: string) {
    const url = `https://github.com/ahmadnasriya/${repoName}.git`;

    const child = spawn("git", ["clone", "--depth", "1", url, target], {
        stdio: "inherit", // pipe stdout/stderr directly
        shell: true       // required on Windows
    });

    return new Promise<number | null>((resolve, reject) => {
        child.on("close", (code) => {
            resolve(code);
        })
    })
}

await clean();

for (const end of ['backend', 'frontend']) {
    const code = await clone(`mystore_${end}`, end);
    if (code !== 0) {
        throw new Error(`Failed to clone mystore_${end}`);
    }
}