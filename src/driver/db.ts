import { Client, type ClientConfig } from 'pg';
import retry from 'retry';

const operation = retry.operation({
    minTimeout: 1000,
    maxTimeout: 5 * 1000,
});

export function connect(config: ClientConfig): Promise<Client> {
    return new Promise<Client>((resolve, reject) => {
        operation.attempt((_) => {
            const db = new Client(config);

            db.connect((err) => {
                if (operation.retry(err)) {
                    return;
                }

                if (err) {
                    reject(err);
                    return;
                }

                resolve(db);
            });
        });
    });
}

export default { connect };
