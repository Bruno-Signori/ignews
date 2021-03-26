import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

    return stripeJs;

}

// TODA CHAVE que precisa ser carregada no browser e é publica é indentificada por NEXT_PUBLIC