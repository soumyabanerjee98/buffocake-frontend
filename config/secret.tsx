export const smtp_cred = {
  from: "boffocakes.official@gmail.com",
  username: "boffocakes.official@gmail.com",
  password: process.env.NEXT_PUBLIC_SMTP_PASS,
  port: 2525,
  server: "smtp.elasticemail.com",
  security_token: process.env.NEXT_PUBLIC_SECURITY_TOKEN,
};
export const el_email_apiKey = process.env.NEXT_PUBLIC_EL_API;
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "boffocake.firebaseapp.com",
  projectId: "boffocake",
  storageBucket: "boffocake.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSGSENDID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};
export const EncKey = process.env.NEXT_PUBLIC_ENCKEY;
export const paytmConfig = {
  // production
  host: "https://securegw.paytm.in",
  mid: process.env.NEXT_PUBLIC_MID,
  mkey: process.env.NEXT_PUBLIC_MKEY,
  // test
  stage_host: "https://securegw-stage.paytm.in",
  stage_mid: process.env.NEXT_PUBLIC_STAGE_MID,
  stage_mkey: process.env.NEXT_PUBLIC_STAGE_MKEY,
};
