import type { Client } from 'pg';
import { BadRequestError } from './error';
import { parse as parseURL } from 'url';

const jsonHeaders = { 'Content-Type': 'application/json' };

// translator translates the HTTP request to SQL backend query
export default async function translator(
    req: Request,
    db: Client,
): Promise<Response> {
    const { method, url } = req;
    const path = parseURL(url, true).path;
    const text = await req.text();

    let payload: string | void = 'null';
    let res, err;

    // Method other than GET and HEAD could have a payload
    if (!['GET', 'HEAD'].includes(method) && text.length > 0) {
        // Validate json payload
        payload = await (async (_) => JSON.parse(text))()
            .then((_) => text)
            .catch((e) => ((err = e), void 0));
    }

    if (!!err) {
        throw new BadRequestError('Invalid JSON payload');
    }

    //
    console.log({ method, path, payload });

    const result = await db.query(
        'SELECT sqlRouter($1 ::VARCHAR, $2 ::VARCHAR, $3 ::JSONB);',
        [method, path, payload],
    );

    res = result.rows[0]['sqlrouter'];

    //
    console.log('result.rows:', result.rows);

    return new Response(JSON.stringify(res), {
        status: res?.status,
        headers: jsonHeaders,
    });
}
