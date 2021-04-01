import { GetStaticProps } from 'next'
import Head from 'next/head'
import Prismic from  '@prismicio/client';
import {RichText} from 'prismic-dom';

import React from 'react'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import Link from 'next/link';


type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updateAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({posts}:PostsProps){
  return (
    <>
    <Head>
      <title>Posts | Ignews</title>
    </Head>

    <main className={styles.container}>
      <div className={styles.posts}>
        {posts.map(post => (
          <Link href={`/posts/${post.slug}`}>
           <a key={post.slug} >
            <time>{post.updateAt}</time>
            <strong>{post.title}</strong>
            <p>{post.excerpt}</p>
         </a>
         </Link>

        ))}

      </div>
    </main>
    
    </>


  )
}


// essa pag nao sera modificada com muita freqeuncia entao get Static para diminuir o tamnaho gasto de recusrsos
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const locale = 'pt-br';

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
    // page size é a paginação.
  })
  const posts = response.results.map(post => {
    // RichText é um conversor de dados para tags html 
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      // Sintaxe abaixo: Estou buscando o primeiro paragrafo. se os mesmo for texto? se não ?? texto em branco ''
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updateAt: new Date(post.last_publication_date).toLocaleDateString(locale, {
        day: 'numeric',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'

      }),
    }
  })
  return {
    props: {
      posts,
    }
  }
}