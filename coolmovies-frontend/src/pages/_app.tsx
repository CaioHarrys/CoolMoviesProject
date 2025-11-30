import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { FC, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import Head from "next/head";
import { createStore } from "../state";
import { EnhancedStore } from "@reduxjs/toolkit";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { css, Global } from "@emotion/react";
import "../styles/CoolerMovieCard.css";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [store, setStore] = useState<EnhancedStore | null>(null);
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  React.useEffect(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: "/graphql",
    });

    const store = createStore({ epicDependencies: { client } });
    setStore(store);
    setClient(client);
  }, []);

  if (!store || !client) return <>{"Loading..."}</>;

  return (
    <>
      <Head>
        <title>Coolmovies Frontend</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* FUNDO DARK HBO MAX EM TODA A TELA */}
      <Global
        styles={css`
          html,
          body,
          #__next {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            background: linear-gradient(#1d1f23, #1f1d24, #151218);
            background-attachment: fixed;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen, Ubuntu, Cantarell, sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          body {
            overflow-x: hidden;
          }
        `}
      />

      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ReduxProvider>
    </>
  );
};

export default App;
