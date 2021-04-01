import { GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/client"
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  }
}




export default function PostPreview({post}: PostPreviewProps){
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription){
      router.push(`/posts/${post.slug}`)
    }
  },[session])

  return (
    <>
    <Head>
      <title>{post.title} | IgNews</title>
    </Head>

    <main className={styles.container}>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>{post.updateAt}</time>
        <div className={`${styles.previewContent}  ${styles.postContent}`}
        dangerouslySetInnerHTML={{__html: post.content}} />
        {/* dangerouslySetInnerHTML serve para setar a formatação das tags html diretamente como vem do servidor */}

        <Link href="/">
        <div className={styles.continuesReading}>
          Wanna continue reading? 
          
            <a>Subscribe Now</a>
        </div>
        </Link>
      </article>
    </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;


  const prismic = getPrismicClient()

  const response = await prismic.getByUID('post', String(slug), {})
 
  const locale = 'pt-br';
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
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
    },
    revalidate: 60 *20, //20min
  }
}