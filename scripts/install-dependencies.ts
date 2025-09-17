import { spawn } from "child_process";
import path from "path";
import fs from 'fs';

async function installFor(cwd: string) {
    const exists = fs.existsSync(path.join(cwd, 'package.json'));
    if (!exists) {
        return;
    }
    
    const child = spawn("npm", ["install"], {
        stdio: "inherit", // pipe stdout/stderr directly
        shell: true,      // required on Windows
        cwd
    });

    return new Promise<number | null>((resolve, reject) => {
        child.on("close", (code) => {
            resolve(code);
        })
    })
}

const cwd = process.cwd();

await installFor(cwd);

for (const end of ['backend', 'frontend']) {
    await installFor(path.join(cwd, end));
}