import { Montserrat } from "@next/font/google";
import Head from "next/head";
import BasicLayout from "../projectComponents/UI/BasicLayout";
import "../styles/global.css";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const _App = (props: any) => {
  const { Component, pageProps } = props;
  if (process.env.NODE_ENV === "production") {
    console.log = console.warn = console.error = () => {};
  }
  return (
    <main className={montserrat.className}>
      <Head>
        <link rel="icon" href="./boffocake-logo.png" />
      </Head>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </main>
  );
};

export default _App;
