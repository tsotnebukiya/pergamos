import type { NextPage } from "next";
import ErrorLayout from "pergamos/components/layouts/ErrorLayout";

const ForbiddenPage: NextPage = () => {
  return (
    <ErrorLayout
      title="Unauthorized"
      errorCode="401"
      description="Sorry, You are not authorized to access this page."
    />
  );
};

export default ForbiddenPage;
