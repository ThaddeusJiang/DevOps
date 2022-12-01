import NextAuth from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // AzureADProvider({
    //   clientId: process.env.AZURE_CLIENT_ID,
    //   clientSecret: process.env.AZURE_CLIENT_SECRET,
    //   tenantId: process.env.AZURE_TENANT_ID,
    // }),
  ],
};

export default NextAuth(authOptions);
