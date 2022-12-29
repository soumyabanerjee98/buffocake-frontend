import Head from 'next/head'
import { metaConfig } from '../Components/Config/siteConfig';
import Home from '../Components/Pages/Home';

const App = () => {
  return (
    <>
      <Head>
        <title>{metaConfig?.home_title}</title>
        <meta name="description" content={metaConfig?.home_desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Home/>
    </>
  )
}

export default App;