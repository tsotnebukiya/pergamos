import { SessionProvider } from "next-auth/react";
import { api } from "pergamos/utils/api";
import "pergamos/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import type { NextPageWithLayout } from "pergamos/utils/types";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        enableColorScheme={false}
        enableSystem={false}
      >
        {layout}
        <Toaster position="top-right" />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
