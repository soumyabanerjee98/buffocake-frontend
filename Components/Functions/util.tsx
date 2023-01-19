import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { processIDs } from "../../config/processID";
import { serverConfig, firebaseConfig } from "../../config/siteConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const gSignInWithPopup = () => signInWithPopup(auth, provider)
.then((res) =>{
    let userInfo = {
        fullName: res?.user?.displayName,
        email: res?.user?.email,
        phone: res?.user?.phoneNumber,
        profileImage: res?.user?.photoURL
    }
    return userInfo
})
.catch((err) => {
    console.log(err?.message);
})

export const gSignOut = () => signOut(auth)
.then(() => {
})
.catch((err) => {
    console.log(err?.message);
});

export const callApi = async (processid: string, datajson: object) => {
    let url = process?.env?.NODE_ENV === 'development' ? serverConfig?.backend_url_test : serverConfig?.backend_url_server
    let data = {
        processId: processid,
        datajson: datajson
    }
    return axios.post(url, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    },
    })
}

export const uploadMedia = (filesArr: any) => {
    try {
     filesArr.map((i: any) => {
        let fData = new FormData();
        fData.append('uploadedFile', i, i?.name);
        let content_type = 'multipart/form-data'
        callApi(processIDs?.upload_media_photos, fData)
        .then((res: any) => {
            console.log(res?.data, 'res');
        })
    })     
    } catch (error) {  
        console.log(`Problem with uploading files: ${error}`);
    }
}

export const getSessionData = (key: string) => {
    try {
        return sessionStorage.getItem(key)
    } catch (error) {
        return null   
    }
}