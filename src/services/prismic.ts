import { DefaultClient } from '@prismicio/client/types/client';
import Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT as string, {
    req,
    accessToken: process.env.PRISMIC_PERMANENT_ACCESS_TOKEN as string,
  });

  return prismic;
}
