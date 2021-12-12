import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import { PostPagination } from '../pages';

export const formatDate = (date: string): string => {
  const formattedDate = format(new Date(date), 'd MMM y', {
    locale: ptBR,
  });

  return formattedDate;
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
