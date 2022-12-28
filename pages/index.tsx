import Head from 'next/head'
import Home from '../components/pages/Home';

const App = () => {
  return (
    <>
      <Head>
        <title>buffocakes</title>
        <meta name="description" content="buffocakes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Home/>
    </>
  )
}

export default App;