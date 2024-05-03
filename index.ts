#!/usr/bin/env bun

import pDB from './src/driver/db';
import translator from './src/driver/translator';
import { $ } from 'bun';
import task from 'tasuku';

const dbCred = {
    host: 'postgresql',
    port: 5432,
    user: 'pg',
    password: 'pg',
    database: 'db',
};

// Generate SQL scripts
async function init() {
    await task('Generating SQL scripts', async ({ task }) => {
        const tasks: Array<string> = [];

        await $`rm -rf plv8ify-dist/*.sql`.quiet().nothrow();

        for await (let file of $`ls src/backend`.lines()) {
            file.length && tasks.push(file);
        }

        await task.group(
            (task) =>
                tasks.map((t) =>
                    task(`Generating ${t}`, async ({ setTitle }) => {
                        await $`bunx plv8ify generate --input-file ./src/backend/${t}`
                            .quiet()
                            .env({});
                        setTitle(`Generated ${t}`);
                    }),
                ),
            { concurrency: Infinity, stopOnError: false },
        );
    });
}

async function main(): Promise<void> {
    // Connect to PostgreSQL
    const db = await pDB.connect(dbCred);
    await task('Connected to PostgreSQL', async () => Promise.resolve());

    // Init extension if not exists
    {
        await task('Init PostgreSQL extension', async ({ setOutput }) => {
            await db.query('CREATE EXTENSION IF NOT EXISTS plv8;');
            setOutput('PostgreSQL extension initialized');
        });
    }

    // Install backend scripts
    {
        await task(
            'Installing backend scripts',
            async ({ setStatus, task }) => {
                $.cwd('./plv8ify-dist');

                for await (let file of $`ls .`.lines()) {
                    if (!file.length) continue;

                    await task(`Installing ${file}`, async ({ setOutput }) => {
                        const fileContent = await $`cat ${file}`.text();
                        await db.query(fileContent);

                        setOutput(`Success`);
                    });
                }

                setStatus('Done ✅');
            },
        );
    }

    // Auto-migrate
    {
        await task('Auto-migrating database', async ({ setOutput }) => {
            await db.query('SELECT autoMigrate();');
            setOutput('Success');
        });
    }

    // Ignite the server
    Bun.serve({
        development: false,
        port: process.env.PORT || 5000,
        async fetch(req) {
            return translator(req, db).catch((err) => {
                return new Response(
                    JSON.stringify({
                        error: {
                            code: err.code || 500,
                            message: err.message || 'Internal Server Error',
                        },
                    }),
                    {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
            });
        },
    });

    await task(
        'Server is running on port ' + (process.env.PORT || 5000),
        async () => Promise.resolve(),
    );
}

!(async function () {
    const [, , isInit] = process.argv;

    !!isInit ? await init() : await main();
})();
