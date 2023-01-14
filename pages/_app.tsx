import { Montserrat } from '@next/font/google'
import Head from 'next/head';
import '../styles/global.css'

const montserrat = Montserrat({
    subsets: ['latin']
})

const _App = (props: any) => {
  const { Component, pageProps } = props;
  return (
    <main className={montserrat.className}>
      <Head>
        <link rel='icon' href='./boffocake-logo.png'/>
      </Head>
      <Component {...pageProps} />
    </main>
  )
}

export default _App