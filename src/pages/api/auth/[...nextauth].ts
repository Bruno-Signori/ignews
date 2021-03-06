import NextAuth from 'next-auth'
import Providers from 'next-auth/providers';
import {query} from 'faunaDb';
import {fauna} from '../../../services/fauna';
import { session } from 'next-auth/client';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
      // scope defin qual campos quero obter
    }
    ),
    // ...add more providers here
  ],
  // estou pegando as infos do usuario no callback, entao elas ficam disponiveis para serem  salvas no banco
  callbacks: {
    async session(session){
      try {
      const  userActiveSubscription = await fauna.query(
        query.Get(
         query.Intersection([
          query.Match(
            query.Index('subscription_by_user_ref'),
            query.Select("ref",
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(session.user.email)
              )
            )
          )
        ),
        query.Match(
          query.Index('subscription_by_status'), "active"
        )
        ])
    )
  )
      return {
        ...session,
        activeSubscription: userActiveSubscription,
      }
    } catch {
      return {
        ...session,
        activeSubscription: null,
      }
    }
    },

    async signIn(user, account, profile) {
      const { email } = user;

      try{
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                query.Index('user_by_email'),
                query.Casefold(user.email)
              )
            )  
          ),
          query.Create(
            query.Collection('users'),
            { data: { email } }
            
          //FQL cheat sheet > ver para mais infos de querys no faunaDB
          ),
          query.Get(
              query.Match(
              query.Index('user_by_email'),
              query.Casefold(user.email)
            )
          )  
        )
      )
        return true;
      
      } catch {
        return false;
      }
    },
  }
})

/* alguns exemplos de Bd para tarbalharmos com Next
faunaDb
dinamoDb
Firebase
supabase
*/