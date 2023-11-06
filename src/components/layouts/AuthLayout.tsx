import { ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader } from "../UI/Card";

interface AuthLayoutProps {
  googleAuth: (event: React.MouseEvent<HTMLButtonElement>) => void;
  githubAuth: (event: React.MouseEvent<HTMLButtonElement>) => void;
  error?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  githubAuth,
  googleAuth,
  error,
}) => {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center py-12 sm:px-6 lg:px-8">
      <div className="flex cursor-default items-center px-10 py-2">
        <ScrollText className="mr-2 h-8 w-8" />
        <h2 className="text-2xl font-bold tracking-tight">Pergamos</h2>
      </div>

      <Card className="mt-6 w-[480px] bg-transparent">
        <CardHeader>
          <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight">
            Sign in to your account
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <button
              onClick={googleAuth}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
            >
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="20px"
                height="20px"
                className="h-5 w-5"
              >
                <path d="M25.997,48C13.312,48,2.992,37.683,2.992,25c0-12.682,10.32-23,23.005-23c5.746,0,11.247,2.13,15.491,5.997l0.774,0.706l-7.588,7.585l-0.703-0.602c-2.226-1.906-5.058-2.956-7.975-2.956c-6.767,0-12.273,5.504-12.273,12.27s5.506,12.27,12.273,12.27c4.879,0,8.733-2.491,10.549-6.737H24.997V20.176l22.549,0.031L47.713,21c1.179,5.582,0.235,13.793-4.528,19.667C39.238,45.533,33.456,48,25.997,48z" />
              </svg>
              <span className="text-sm font-semibold leading-6">Google</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
