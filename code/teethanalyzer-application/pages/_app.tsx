import "../styles/globals.css";
import type { AppProps } from "next/app";
// This layout wraps every page with shared UI
import Layout from "components/layout";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import { PredictionProvider } from "context/PredictionContext";

// A special file in Next.js that wraps every page in your app.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <PredictionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PredictionProvider>  
    </ApolloProvider>
  );
}
