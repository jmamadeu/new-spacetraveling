import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { v4 } from 'uuid';
import { getPrismicClient } from '../../services/prismic';
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
      body: string;
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: NextPage<PostProps> = ({ post }) => (
  <>
    <Head>
      <title>SpaceTraveling | {post.data.title}</title>
    </Head>

    <main>
      <img
        className={styles.image}
        src={post.data.banner.url}
        alt={post.data.title}
      />

      <section>
        <article>
          <h1>Title</h1>
          <div>
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
          <article key={v4()}>
            <h1>{content.heading}</h1>

            <div dangerouslySetInnerHTML={{ __html: content.body }} />
          </article>
        ))}
      </section>
    </main>
  </>
);

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
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

    const post: Post = {
      first_publication_date: response.first_publication_date,
      data: {
        author: RichText.asText(response.data.author),
        banner: {
          url: response.data.banner.url,
        },
        title: RichText.asText(response.data.title),
        content: response.data.content.map((cont: any) => ({
          body: RichText.asHtml(cont.body),
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
