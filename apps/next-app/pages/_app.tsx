import { FC, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { SessionProvider as Provider, getSession, signIn, useSession } from "next-auth/react";
import type { AppProps } from "next/app";

import axios from "axios";
import { AnimatePresence } from "framer-motion";

import Layout from "../components/Layout";
import ScreenLoading from "../components/Loading/ScreenLoading";
import "../styles/globals.css";
import "../utils/dayjsPreset";

if (process.env.NEXT_PUBLIC_API_MOCKING === "yes") {
  if (typeof window === "undefined") {
    import("../mocks/server").then(({ server }) => {
      server.listen();
    });
  } else {
    import("../mocks/browser").then(({ browser }) => {
      browser.start();
    });
  }
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.interceptors.request.use(async (request) => {
  const session = await getSession();

  if (session) {
    request.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
  }
  return request;
});

const queryClient = new QueryClient();

const handleExitComplete = (): void => {
  if (typeof window !== "undefined" && window.location.hash) {
    const element = document.querySelector(window.location.hash);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
};

function Auth({ children }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const isUser = !!session?.user;

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn();
    }
  }, [session]);

  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <ScreenLoading />;
}

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence exitBeforeEnter onExitComplete={handleExitComplete}>
        <Toaster key="toaster" position="top-right" />
        <Provider key="provider" session={pageProps.session}>
          <Auth>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Auth>
        </Provider>
      </AnimatePresence>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
