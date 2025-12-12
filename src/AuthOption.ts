import DataServices from "@/services/requestApi";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import queryString from "query-string";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userToken: { label: "UserToken", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const response = await DataServices.Login(
              queryString.stringify(credentials),
            );
            return {
              ...response.data,
            } as User;
          } catch (error: any) {
            throw new Error(error.response?.data.message);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      if (trigger === "update" && session) {
        token.user = session;
        return token;
      }
      if (account?.provider === "credentials" && user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token?.user;
        return session;
      }
      session.user = token as any;
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
