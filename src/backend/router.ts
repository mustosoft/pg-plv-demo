import type { Request, Response } from './type';
import url, { URL } from 'url';
import { AuthorSchema, BookSchema } from './validator';

// @ts-ignore
globalThis['URL'] = URL;
// @ts-ignore
globalThis['self'] = globalThis;

const routers: Array<[string | RegExp, (req: Request) => Response]> = [
    [
        /^POST \/author$/,
        (req): Response => {
            let query =
                'INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING *;';

            const value = AuthorSchema.parse(req.body);

            // @ts-ignore
            const rows: Array<any> = plv8.execute(query, [
                value.name,
                value.bio,
            ]);

            return {
                status: 200,
                data: rows[0],
            };
        },
    ],
    [
        /^GET \/authors$/,
        (req): Response => {
            // @ts-ignore
            const rows: Array<any> = plv8.execute('SELECT * FROM authors');

            return {
                status: 200,
                data: {
                    items: rows,
                },
            };
        },
    ],
    [
        /^POST \/books$/,
        (req): Response => {
            const values = [];
            const valueStrings = [];

            let query =
                'INSERT INTO books (title, author, description, isbn) VALUES ';

            for (const b of req.body) {
                const value = BookSchema.parse(b);

                values.push([
                    value.title,
                    value.author,
                    value.description,
                    value.isbn,
                ]);

                valueStrings.push(
                    `($${values.length * 4 - 3}, $${values.length * 4 - 2}, $${
                        values.length * 4 - 1
                    }, $${values.length * 4})`,
                );
            }

            query += valueStrings.join(', ') + ' RETURNING *;';

            // @ts-ignore
            const rows: Array<any> = plv8.execute(query, values.flat());

            return {
                status: 200,
                data: {
                    items: rows,
                },
            };
        },
    ],
    [
        /^GET \/books$/,
        (req): Response => {
            // @ts-ignore
            const rows: Array<any> = plv8.execute('SELECT * FROM books');

            return {
                status: 200,
                data: {
                    items: rows,
                },
            };
        },
    ],
    [
        'GET /books/(?<id>\\d+)',
        (req): Response => {
            const { id } = req.param!;

            // @ts-ignore
            const rows: Array<any> = plv8.execute(
                'SELECT * FROM books where id = $1',
                [Number(id)],
            );

            if (rows.length === 0) {
                return {
                    status: 404,
                    data: null,
                    error: {
                        code: 404,
                        name: 'ErrNotFound',
                        message: 'Book not found',
                    },
                };
            }

            return {
                status: 200,
                data: {
                    items: rows,
                },
            };
        },
    ],
    [
        /^(GET|POST) \//,
        (req): Response => {
            return {
                status: 200,
                data: {
                    response: 'Hello, World!',
                    request: req,
                },
            };
        },
    ],
];

export function sqlRouter(
    method: string,
    path: string,
    payload: any,
): Response {
    const uri = `${method} ${path}`;

    const router = routers.find(([matcher]) => uri.match(matcher));

    if (!router) {
        return {
            status: 404,
            data: null,
            error: {
                code: 404,
                name: 'ErrNotFound',
                message: 'Route not found',
            },
        };
    }

    try {
        const res = router[1]({
            method,
            url: path,
            body: payload,
            param: uri.match(router[0])?.groups,
            query: url.parse(path, true).query,
        });

        return res;
    } catch (err) {
        return {
            status: 500,
            data: null,
            error: {
                code: 500,
                name: 'ErrInternal',
                message: `Internal Server Error`,
                original: err,
            },
        };
    }
}
