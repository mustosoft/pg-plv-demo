export type ErrorResponse = {
    code: number;
    name: string;
    message: string;
    original?: any;
};

export type Request = {
    method: string;
    url: string;
    body?: any;
    param?: Record<string, string>;
    query?: Record<string, string | string[] | undefined>;
};

export type Response = {
    status: number;
    data: any;
    error?: ErrorResponse | null | void;
};
