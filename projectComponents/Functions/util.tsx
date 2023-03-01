import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "../../config/secret";
import { serverConfig } from "../../config/siteConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const gSignInWithPopup = () => signInWithPopup(auth, provider);

export const gSignOut = () => signOut(auth);

export const callApiISR = async (processid: string, datajson: object) => {
  let url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  let data = {
    processId: processid,
    datajson: datajson,
  };
  let returnData = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 10,
    },
  });
  return returnData;
};

export const callApiSSG = async (processid: string, datajson: object) => {
  let url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  let data = {
    processId: processid,
    datajson: datajson,
  };
  let returnData = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });
  return returnData;
};

export const callApiSSR = async (processid: string, datajson: object) => {
  let url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  let data = {
    processId: processid,
    datajson: datajson,
  };
  let returnData = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });
  return returnData;
};

export const uploadImage = async (filesArr: any) => {
  if (filesArr?.length > 0) {
    const formData = new FormData();
    let url =
      process?.env?.NODE_ENV === "development"
        ? serverConfig?.backend_url_test
        : serverConfig?.backend_url_server;
    filesArr.map((i: any) => {
      formData.append("files", i);
    });
    let returnData = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return returnData;
  }
};

export const getSessionStringData = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

export const setSessionStringData = (key: string, value: any) => {
  try {
    return sessionStorage.setItem(key, value);
  } catch (error) {
    return null;
  }
};

export const getSessionObjectData = (key: string) => {
  try {
    let value: any = sessionStorage.getItem(key);
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const setSessionObjectData = (key: string, value: any) => {
  try {
    return sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return null;
  }
};

export const removeSessionData = (key: string) => {
  try {
    return sessionStorage?.removeItem(key);
  } catch (error) {
    return null;
  }
};

export const getLocalStringData = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

export const setLocalStringData = (key: string, value: any) => {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {
    return null;
  }
};

export const getLocalObjectData = (key: string) => {
  try {
    let value: any = localStorage.getItem(key);
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const setLocalObjectData = (key: string, value: any) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return null;
  }
};

export const removeLocalData = (key: string) => {
  try {
    return localStorage?.removeItem(key);
  } catch (error) {
    return null;
  }
};
