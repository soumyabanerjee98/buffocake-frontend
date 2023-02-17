import BasicLayout from "../projectComponents/UI/BasicLayout";
import "../styles/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <ToastContainer />
    </main>
  );
};

export default _App;
