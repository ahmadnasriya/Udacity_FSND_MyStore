import { ChildProcess, spawn, exec } from 'child_process';
import path from 'path';
import configs from '../configs';

interface ServerProcessConfigs {
    cwd: string;
    cmd: string;
    pingEndpoint?: string;
}

class ServerProcess {
    readonly #_cwd: string;
    readonly #_command: string;
    readonly #_pingEndpoint?: string;
    #_child?: ChildProcess;

    constructor(configs: ServerProcessConfigs) {
        this.#_cwd = configs.cwd;
        this.#_command = configs.cmd;
        if (configs.pingEndpoint) {
            this.#_pingEndpoint = configs.pingEndpoint;
        }
    }

    readonly #_helpers = {
        ping: async () => {
            try {
                const res = await fetch(this.#_pingEndpoint!);
                return res.ok;
            } catch (error) {
                return false;
            }
        },
        untilOnline: async (timeoutMs = 60_000) => {
            const start = Date.now();
            while (true) {
                if (await this.#_helpers.ping()) return;
                if (Date.now() - start > timeoutMs) {
                    throw new Error(`Server not responding after ${timeoutMs / 1000}s`);
                }
                await new Promise(res => setTimeout(res, 200));
            }
        }
    }

    async start() {
        const [cmdName, ...cmdArgs] = this.#_command.split(' ');
        this.#_child = spawn(cmdName, cmdArgs, {
            stdio: 'inherit',
            shell: true,
            cwd: this.#_cwd
        });

        if (this.#_pingEndpoint) {
            await this.#_helpers.untilOnline();
        } else {
            return new Promise<void>((resolve, reject) => {
                this.#_child!.on('close', () => resolve());
            })
        }
    }

    get process() {
        return this.#_child;
    }
}

const backend = new ServerProcess({
    cwd: path.join(process.cwd(), 'backend'),
    pingEndpoint: `http://localhost:${configs.backend.port}/_api/ping`,
    cmd: 'npm start'
});

const frontendEnv = new ServerProcess({
    cwd: path.join(process.cwd(), 'frontend'),
    cmd: 'npm run prepare-env'
})

const frontend = new ServerProcess({
    cwd: path.join(process.cwd(), 'frontend'),
    pingEndpoint: `http://localhost:${configs.frontend.port}`,
    cmd: `ng serve --port ${configs.frontend.port}`
})

const consoleX = {
    logs: [] as string[],
    log(log: string) {
        this.logs.push(log);
        console.log(log);
    },
    clear() {
        console.clear();
        for (const log of this.logs) {
            console.log(log);
        }
    },
    reset() {
        this.logs = [];
        console.clear();
    }
}

async function start() {
    const onError = (error: Error) => {
        console.error(error);
        process.exit(1);
    }

    backend.process?.on('error', onError);
    frontendEnv.process?.on('error', onError);
    frontend.process?.on('error', onError);

    consoleX.log('⏳ Starting backend process...');
    await backend.start();
    consoleX.clear();
    consoleX.log('✅ Backend process started');

    consoleX.log('⏳ Preparing frontend environment...');
    await frontendEnv.start();
    consoleX.log('✅ Environment prepared');

    consoleX.log('⏳ Starting frontend process...');
    consoleX.log('- Please wait until the page automatically opens');
    await frontend.start();
    consoleX.log('✅ Frontend process started');
}

function afterStart() {
    consoleX.reset();
    console.log('✅ All processes started');

    const appUrl = `http://localhost:${configs.frontend.port}`;
    console.log(`🌍 Accessible via ${appUrl}`);

    const openUrl = (url: string) => {
        const platform = process.platform;
        if (platform === "win32") {
            exec(`start ${url}`);
        } else if (platform === "darwin") {
            exec(`open ${url}`);
        } else {
            exec(`xdg-open ${url}`);
        }
    }

    openUrl(appUrl);
}


await start().then(() => afterStart());