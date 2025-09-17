import fs from 'fs';
import path from 'path';
import configs from '../configs.ts';

const helpers = {
    validate: {
        port: (port: unknown) => {
            // Convert string numbers safely
            const num = Number(port);

            return Number.isInteger(num) && num >= 1 && num <= 65535;
        }
    }
}

async function buildBackend() {
    const filePath = path.join(process.cwd(), 'backend', '.env')
    const lines = [
        '### AuthCrypto ###',
        'AuthCrypto_ROUNDS=10',
        'AuthCrypto_PASSWORDS_MIN=8',
        'AuthCrypto_PASSWORDS_MAX=32',
        '',
        'TOKEN_SECRET=your-secret',
        '',
        '### Runtime Environment ###',
        'RUNTIME_ENV=prod',
        'CREATE_SAMPLE_DATA=true'
    ];

    if (!('frontend' in configs) || !configs.frontend) {
        throw new Error('"frontend" is not defined. Please check "configs.json" file.');
    }

    const frontend = configs.frontend;
    if ('port' in frontend) {
        const port = frontend.port;
        if (!helpers.validate.port(port)) {
            throw new Error(`"frontend.port" is not a valid port number. Please check "configs.json" file.`);
        }

        lines.push(`ANGULAR_PORT=${frontend.port}`);
    } else {
        throw new Error('"frontend.port" is not defined. Please check your environment variables.');
    }

    if (!('backend' in configs) || !configs.backend) {
        throw new Error('"backend" is not defined. Please check "configs.json" file.');
    }

    const backend = configs.backend;
    if ('port' in backend) {
        const port = backend.port;
        if (!helpers.validate.port(port)) {
            throw new Error(`"backend.port" is not a valid port number. Please check "configs.json" file.`);
        }

        lines.push(`APP_PORT=${backend.port}`);
    } else {
        throw new Error('"backend.port" is not defined. Please check your environment variables.');
    }

    if (!('database' in configs.backend) || !configs.backend.database) {
        throw new Error('"backend.database" is not defined. Please check "configs.json" file.');
    }

    const database = configs.backend.database;
    lines.push('', '### DATABASE ###');
    if ('host' in database) {
        if (typeof database.host !== 'string') {
            throw new Error('"backend.database.host" is not a string. Please check "configs.json" file.');
        }

        if (database.host.trim().length === 0) {
            throw new Error('"backend.database.host" is empty. Please check "configs.json" file.');
        }

        lines.push(`POSTGRES_HOST=${database.host.trim()}`);
    } else {
        throw new Error('"backend.database.host" is not defined. Please check "configs.json" file.');
    }

    if ('port' in database) {
        const port = database.port;
        if (!helpers.validate.port(port)) {
            throw new Error(`"backend.database.port" is not a valid port number. Please check "configs.json" file.`);
        }

        lines.push(`POSTGRES_PORT=${port}`);
    } else {
        lines.push('POSTGRES_PORT=5432');
    }

    if ('name' in database) {
        const name = database.name;
        if (typeof name !== 'string') {
            throw new Error('"backend.database.name" is not a string. Please check "configs.json" file.');
        }

        if (name.trim().length === 0) {
            throw new Error('"backend.database.name" is empty. Please check "configs.json" file.');
        }

        lines.push(`POSTGRES_DATABASE=${name.trim()}`);
    } else {
        lines.push('POSTGRES_DATABASE=storefront');
    }

    if ('user' in database) {
        const user = database.user;
        if (typeof user !== 'string') {
            throw new Error('"backend.database.user" is not a string. Please check "configs.json" file.');
        }

        if (user.trim().length === 0) {
            throw new Error('"backend.database.user" is empty. Please check "configs.json" file.');
        }

        lines.push(`POSTGRES_USER=${user.trim()}`);
    } else {
        lines.push('POSTGRES_USER=myuser');
    }

    if ('password' in database) {
        const password = database.password;
        if (typeof password !== 'string') {
            throw new Error('"backend.database.password" is not a string. Please check "configs.json" file.');
        }

        if (password.trim().length === 0) {
            throw new Error('"backend.database.password" is empty. Please check "configs.json" file.');
        }

        lines.push(`POSTGRES_PASSWORD=${password.trim()}`);
    } else {
        lines.push('POSTGRES_PASSWORD=mypassword');
    }

    const content = lines.join('\n');
    await fs.promises.writeFile(filePath, content, { encoding: 'utf8' });
}

async function buildFrontend() {
    const { frontend, backend } = configs;
    const filePath = path.join(process.cwd(), 'frontend', '.env');
    const lines = [
        `BACKEND_HOST=http://localhost:${configs.backend.port}`,
        `BACKEND_PORT=${configs.backend.port}`,
    ]

    if ('siteName' in frontend) {
        const siteName = frontend.siteName;
        if (typeof siteName !== 'string') {
            throw new Error('"frontend.siteName" is not a string. Please check "configs.json" file.');
        }

        if (siteName.trim().length === 0) {
            throw new Error('"frontend.siteName" is empty. Please check "configs.json" file.');
        }

        lines.push(`SITE_NAME=${siteName.trim()}`);
    } else {
        lines.push('SITE_NAME=Nasriya Store');
    }

    const content = lines.join('\n');
    await fs.promises.writeFile(filePath, content, { encoding: 'utf8' });
}

await buildBackend();
await buildFrontend();