import type { NextPage } from "next";
import ErrorLayout from "pergamos/components/layouts/ErrorLayout";

const ErrorPage: NextPage = () => {
  return (
    <ErrorLayout
      title="Internal Error"
      errorCode="500"
      description="Sorry, there is an internal server error."
    />
  );
};

export default ErrorPage;
