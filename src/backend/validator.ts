import { z } from 'zod';

export const AuthorSchema = z
    .object({
        name: z.string(),
        bio: z.string(),
    })
    .required();

export const BookSchema = z
    .object({
        title: z.string(),
        author: z.number(),
        description: z.string(),
        isbn: z.number().min(1000000000000).max(9999999999999).nullable(),
    })
    .required();
