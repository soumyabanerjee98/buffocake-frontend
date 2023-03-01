import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { EncKey, firebaseConfig } from "../../config/secret";
import { serverConfig } from "../../config/siteConfig";
const CryptoJS = require("crypto-js");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const gSignInWithPopup = () => signInWithPopup(auth, provider);

export const gSignOut = () => signOut(auth);

export const callApi = async (processid: string, datajson: object) => {
  try {
    let url =
      process?.env?.NODE_ENV === "development"
        ? serverConfig?.backend_url_test
        : serverConfig?.backend_url_server;
    let data = {
      processId: processid,
      datajson: datajson,
    };
    return axios.post(url, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: serverConfig?.request_timeout,
    });
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (filesArr: any) => {
  try {
    if (filesArr?.length > 0) {
      const formData = new FormData();
      let url =
        process?.env?.NODE_ENV === "development"
          ? serverConfig?.backend_url_test
          : serverConfig?.backend_url_server;
      filesArr.map((i: any) => {
        formData.append("files", i);
      });
      return axios.post(`${url}imageUpload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: serverConfig?.request_timeout,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSessionStringData = (key: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(sessionStorage.getItem(key), EncKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    return null;
  }
};

export const setSessionStringData = (key: string, value: any) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(value, EncKey).toString();
    return sessionStorage.setItem(key, ciphertext);
  } catch (error) {
    return null;
  }
};

export const getSessionObjectData = (key: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(sessionStorage.getItem(key), EncKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    return null;
  }
};

export const setSessionObjectData = (key: string, value: any) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      EncKey
    ).toString();
    return sessionStorage.setItem(key, ciphertext);
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
    const bytes = CryptoJS.AES.decrypt(localStorage.getItem(key), EncKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    return null;
  }
};

export const setLocalStringData = (key: string, value: any) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(value, EncKey).toString();
    return localStorage.setItem(key, ciphertext);
  } catch (error) {
    return null;
  }
};

export const getLocalObjectData = (key: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(localStorage.getItem(key), EncKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    return null;
  }
};

export const setLocalObjectData = (key: string, value: any) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      EncKey
    ).toString();
    return localStorage.setItem(key, ciphertext);
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
