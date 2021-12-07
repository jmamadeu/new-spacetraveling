import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { PostPagination } from '../pages';
import { RichText } from 'prismic-dom';

export const formatDate = (date: string): string => {
  const newDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  return newDate;
};

export function parsePosts(post: ApiSearchResponse): PostPagination {
  const results: PostPagination = {
    next_page: post.next_page,
    results: post.results.map(r => ({
      uid: r.uid,
      first_publication_date: formatDate(r.first_publication_date as string),
      data: {
        author: RichText.asText(r.data.author),
        subtitle: RichText.asText(r.data.subtitle),
        title: RichText.asText(r.data.title),
      },
    })),
  };

  return results;
}
