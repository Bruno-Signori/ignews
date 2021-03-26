import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import {getSession} from 'next-auth/client'


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    const STRIPE_COSTUMER = await stripe.customers.create({
      email: session.user.email,
      //metadata
    })

    const STRIPE_CHECKOUT_SESSION = await stripe.checkout.sessions.create({
      customer: STRIPE_COSTUMER.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1IYL7aHzqONovSKwhOJ0wm0N', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,

    })
    
    return res.status(200).json({sessionId: STRIPE_CHECKOUT_SESSION.id })

  } else {
    res.setHeader('Allow','POST')
    res.status(405).end('Method no allowed')
  }

}