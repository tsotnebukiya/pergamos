import NextAuth from "next-auth";
import { authOptions } from "pergamos/server/auth";

export default NextAuth(authOptions);
