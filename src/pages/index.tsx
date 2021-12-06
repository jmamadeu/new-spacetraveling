import { GetStaticProps, NextPage } from 'next';

import Head from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: NextPage<HomeProps> = () => (
  <>
    <Head>
      <title>Home | Space Traveling</title>
    </Head>
    <h1>Home</h1>
  </>
);

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'post'),
  ]);

  console.log(postsResponse);

  return {
    props: {
      a: 1,
    },
  };
};
