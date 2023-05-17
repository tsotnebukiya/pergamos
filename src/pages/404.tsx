import type { NextPage } from "next";
import ErrorLayout from "pergamos/components/layouts/ErrorLayout";

const Page404: NextPage = () => {
  return (
    <ErrorLayout
      description="Sorry, we couldn’t find the page you’re looking for."
      errorCode="404"
      title="Page not found"
    />
  );
};

export default Page404;
