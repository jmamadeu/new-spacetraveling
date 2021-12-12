import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { v4 } from 'uuid';
import { getPrismicClient } from '../../services/prismic';
import { formatDate } from '../../utils/posts';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: { text: string }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: NextPage<PostProps> = ({ post }) => (
  <>
    <Head>
      <title>SpaceTraveling | {post?.data?.title ?? ''}</title>
    </Head>

    <main>
      <img
        className={styles.image}
        src={post.data.banner.url}
        alt={post.data.title}
      />

      <section className={styles.postContent}>
        <article>
          <h1>{post.data.title}</h1>
          <div className={styles.labels}>
            <span>
              <FiCalendar size={12} /> {post.first_publication_date}
            </span>
            <span>
              <FiUser size={12} /> {post.data.author}
            </span>

            <span>
              <FiClock size={12} /> 4min
            </span>
          </div>
        </article>

        {post.data.content.map(content => (
          <article key={v4()} className={styles.postBody}>
            <h2>{content.heading}</h2>

            {content.body.map(body => (
              <div
                key={v4()}
                dangerouslySetInnerHTML={{ __html: body?.text }}
              />
            ))}
          </article>
        ))}
      </section>
    </main>
  </>
);

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  try {
    const postsResponse = await prismic.query(
      [Prismic.Predicates.at('document.type', 'post')],
      { pageSize: 2, page: 1 }
    );

    const posts = postsResponse?.results?.map(post => ({
      params: {
        slug: post?.uid as string,
      },
    }));

    return {
      paths: posts,
      fallback: 'blocking',
    };
  } catch {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  try {
    if (!params?.slug) {
      return {
        props: {},
      };
    }

    const response = await prismic.getByUID('post', params.slug as string, {});

    if (!response.uid || !response.first_publication_date)
      return {
        props: {},
      };

    const post: Post = {
      first_publication_date: formatDate(response.first_publication_date),
      data: {
        author: RichText.asText(response.data.author),
        banner: {
          url: response.data.banner?.url ?? '',
        },
        title: RichText.asText(response.data.title),
        content: response.data.content.map((cont: any) => ({
          body: cont.body.map((body: any) => ({
            text: RichText.asHtml([body]),
          })),
          heading: RichText.asText(cont.heading),
        })),
      },
    };

    return {
      props: { post },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
};
