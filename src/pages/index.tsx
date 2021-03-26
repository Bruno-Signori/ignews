import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss'


interface HomeProps {
  product: {
    priceId: string,
    amount: number,
  }
}

export default function Home({product}:HomeProps ) {
  return (
    <>
    <Head>
        <title>Home | ig.news Inicio</title>
    </Head>    
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>get acess to all the publications <br />
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId} />
    
      </section>
    <img src="/images/avatar.svg" alt="girl coding" />

    </main>
  </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IYL7aHzqONovSKwhOJ0wm0N', {
    // para mostrar detalhes do produto usar -> expand: ['product']
  })

  const product = {
    priceId: price.id,
    //formatando o price
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    // quanto tempo em segundos eu quero qeu essa pagina seja recriada
    revalidate: 60 * 60 * 24, // 24hs
  }

}


// Client-side = se eu nao preciso de indexação e disponibilizar os dados de forma estatica.. posso fazer a chamada normal pelo lado do cliente! >useEffect + useState. Ex: 
// Static-Site-Generation<->getStaticProps = é mais performatico -- nao consigo fazer chamadas customizadas por usuario. ex: Catalo de produtos, preços
// Server-side-Rendering<->getServerSideProps = nos permite sermos mais dinamicos -- posso pegar dados do usuario logado por ex. Ex: dados em tempo real de um cliente

/* Post de Blog

Conteúdo -> (SSG)
Comentários -> (Clien-Side)

*/