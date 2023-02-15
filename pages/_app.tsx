import BasicLayout from "../projectComponents/UI/BasicLayout";
import "../styles/global.css";

const _App = (props: any) => {
  const { Component, pageProps } = props;
  if (process.env.NODE_ENV === "production") {
    console.log = console.warn = console.error = () => {};
  }
  return (
    <main>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </main>
  );
};

export default _App;
