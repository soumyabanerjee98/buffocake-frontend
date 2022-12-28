import { Montserrat } from '@next/font/google'

const montserrat = Montserrat({
    subsets: ['latin']
})

const _App = ({ Component, pageProps }) => {
  return (
    <main className={montserrat.className}>
      <Component {...pageProps} />
    </main>
  )
}

export default _App