import Head from 'next/head'
import { metaConfig } from '../Config/siteConfig';
import Home from '../Components/Pages/Home';
import BasicLayout from '../Components/UI/BasicLayout';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>{metaConfig?.home_title}</title>
        <meta name="description" content={metaConfig?.home_desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BasicLayout>
        <Home/>
      </BasicLayout>
    </>
  )
}

export default HomePage;