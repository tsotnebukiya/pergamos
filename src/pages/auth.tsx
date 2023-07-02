import type { GetServerSidePropsContext, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AuthLayout from "pergamos/components/layouts/AuthLayout";
import { getServerAuthSession } from "pergamos/server/auth";
import { env } from "pergamos/env.mjs";

const AuthPage: NextPage = () => {
  const router = useRouter();

  const { status } = useSession();
  if (status === "authenticated") {
    void router.push("/dashboard");
  }
  const googleAuth = () => {
    void signIn("google");
  };

  const githubAuth = () => {
    void signIn("github");
  };
  return (
    <AuthLayout
      googleAuth={googleAuth}
      githubAuth={githubAuth}
      error={router.query.error as string}
    />
  );
};

export default AuthPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session?.user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
