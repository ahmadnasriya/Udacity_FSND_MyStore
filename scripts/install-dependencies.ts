import { spawn } from "child_process";
import path from "path";

async function installFor(cwd: string) {
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

for (const end of ['backend', 'frontend']) {
    await installFor(path.join(cwd, end));
}