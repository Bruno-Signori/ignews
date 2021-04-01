import { fauna } from "../../../services/fauna";
import {query} from 'faunadb';
import { stripe } from "../../../services/stripe";


export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createaction = false,
) {
  // Bucar o usuario no canco do fauna com id customerId
  // salvar os dados da subcription no faunadb
  const userRef = await fauna.query(
    query.Select(
      "ref",
      query.Get(
        query.Match(
          query.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )
    // buscar todos os dados da subscriptionId

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    //estou pegando os dados retornados, mas apenas os que me interessam.
    const subscriptionData = {
      id: subscription.id,
      userid: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id

    }

    if (createaction) {
      await fauna.query(
        query.Create(
          query.Collection('subscriptions'), 
          {data: subscriptionData}
        )
      )
    } else {    
      // attualização -> seleciono depois passo o novo parametro
      await fauna.query(
        query.Replace(
          query.Select(
            "ref",
            query.Get(
              query.Match(
                query.Index('subscription_by_id'),
                subscriptionId
              )
            )
          ),
          {data: subscriptionData }
        )
      )

    }

    
    //.\stripe listen --forward-to localhost:3000/api/webhooks
  
}