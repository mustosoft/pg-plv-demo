export class BadRequestError extends Error {
    code: number;

    constructor(message: any) {
        super(message);
        this.name = 'BadRequestError';
        this.message = message;
        this.code = 400;
    }
}

export class InternalServerError extends Error {
    code: number;

    constructor(message: any) {
        super(message);
        this.name = 'InternalServerError';
        this.message = message;
        this.code = 500;
    }
}