import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import styles from './post.module.scss'

interface PostsProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  }
}


export default function Post({post}: PostsProps){
  return (
    <>
    <Head>
      <title>{post.title} | IgNews</title>
    </Head>

    <main className={styles.container}>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>{post.updateAt}</time>
        <div className={styles.postContent}
        dangerouslySetInnerHTML={{__html: post.content}} />
        {/* dangerouslySetInnerHTML serve para setar a formatação das tags html diretamente como vem do servidor */}
      </article>
    </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  //console.log(session)
  if (!session?.activeSubscription){
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }

  }
  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID('post', String(slug), {})
 
  const locale = 'pt-br';
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updateAt: new Date(response.last_publication_date).toLocaleDateString(locale, {
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'

    }),
  }
  return {
    props: {
      post,
    }
  }
}