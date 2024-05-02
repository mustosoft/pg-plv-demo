export function autoMigrate() {
    // @ts-ignore
    // Table authors
    plv8.execute(
        `CREATE TABLE IF NOT EXISTS authors (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            bio TEXT
        );`,
    );

    // @ts-ignore
    // Table books
    plv8.execute(
        `CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            author SERIAL NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
            description TEXT NOT NULL,
            isbn BIGINT DEFAULT NULL
        );`,
    );

    // @ts-ignore
    plv8.elog(NOTICE, 'Migrations completed!');
}
