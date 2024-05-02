import { AuthorSchema } from './validator';

interface Author {
    name: string;
    bio: string;
}

export function validateAuthor(author: Author): Author {
    return AuthorSchema.parse(author);
}

// const res = await validateAuthor({ name: "me", bio: "" } as Author).catch(console.error);

// console.log({ res })
