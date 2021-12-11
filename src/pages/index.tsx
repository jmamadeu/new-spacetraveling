import Prismic from '@prismicio/client';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';
import { parsePosts } from '../utils/posts';
import styles from './home.module.scss';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: NextPage<HomeProps> = ({
  postsPagination: defaultPostsPagination,
}) => {
  const [postsPagination, setPostPagination] = useState<PostPagination>(
    defaultPostsPagination
  );

  useEffect(() => {
    setPostPagination(defaultPostsPagination);
  }, [defaultPostsPagination]);

  const handleLoadNewPage = async (): Promise<void> => {
    if (!postsPagination.next_page) return;
    try {
      const postsResponse = await fetch(postsPagination.next_page).then(res =>
        res.json()
      );
      console.log(postsResponse);
      const postsParsed = parsePosts(postsResponse);

      setPostPagination(current => ({
        ...postsParsed,
        results: [...current.results, ...postsParsed.results],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>

      <main className={styles.container}>
        <section>
          {postsPagination.results.map(post => (
            <Link key={post.uid} href={`post/${post.uid}`}>
              <a className={styles.contentContainer}>
                <article key={post.uid}>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>

                  <div>
                    <span>
                      <FiCalendar size={12} /> {post.first_publication_date}
                    </span>
                    <span>
                      <FiUser size={12} /> {post.data.author}
                    </span>
                  </div>
                </article>
              </a>
            </Link>
          ))}

          {postsPagination.next_page ? (
            <button
              type="button"
              className={styles.button}
              onClick={handleLoadNewPage}
            >
              Load more posts
            </button>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    { pageSize: 2, page: 1 }
  );

  const results: PostPagination = parsePosts(postsResponse);

  return {
    props: {
      postsPagination: results,
    },
  };
};
