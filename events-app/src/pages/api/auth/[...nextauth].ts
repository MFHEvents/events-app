// pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb"; // Replace with your database connection logic
import Attendee from "@/models/Attendee";
import bcrypt from 'bcrypt'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          //validate credentials...
          if (!credentials) {
            throw new Error("credentials undefined.");
          }

          // Find the user in the database
          const user = await Attendee.findOne({
            email: credentials.email,
          }).select("+passwordHash");

          //to-do use same error msg
          if (!user || !user.passwordHash) {
            throw new Error("No user has signed up with that email.");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.passwordHash
          );
          if (!isValid) {
            throw new Error("Invalid password.");
          }

          // Return the user object if authentication succeeds
          return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` };
          // return null
        } catch (err: any) {
          console.error("Error while signing in:", err);
          throw new Error(err)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};  // Initialize as an empty object if undefined
    }
    
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      console.log({session})
      return session;
    },
  },
});

export const hashPassword = async (password: string) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
}