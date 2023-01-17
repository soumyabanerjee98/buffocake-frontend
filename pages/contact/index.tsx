import Head from 'next/head'
import Contact from '../../Components/Pages/Contact';
import BasicLayout from '../../Components/UI/BasicLayout';
import { metaConfig } from '../../config/siteConfig';

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>{metaConfig?.contact_title}</title>
        <meta name="description" content={metaConfig?.contact_desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BasicLayout>
        <Contact/>
      </BasicLayout>
    </>
  )
}

export default ContactPage;