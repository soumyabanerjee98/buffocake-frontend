import { Montserrat } from '@next/font/google'
import '../styles/global.css'

const montserrat = Montserrat({
    subsets: ['latin']
})

const _App = (props: any) => {
  const { Component, pageProps } = props;
  return (
    <main className={montserrat.className}>
      <Component {...pageProps} />
    </main>
  )
}

export default _App