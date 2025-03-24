import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
}

const handler = NextAuth(config)
export { handler as GET, handler as POST }
