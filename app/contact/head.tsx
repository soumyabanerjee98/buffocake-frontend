import React from "react";
import { metaConfig } from "../../config/siteConfig";

const ContactPageHead = () => {
  return (
    <>
      <title>{metaConfig?.contact_title}</title>
      <meta name="description" content={metaConfig?.contact_desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export default ContactPageHead;
