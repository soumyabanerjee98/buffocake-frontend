import axios from "axios";
import { processIDs } from "../../Config/processID";
import { serverConfig } from "../../Config/siteConfig";

export const callApi = (processid: string, datajson: object, config: any) => {
    let url = process?.env?.NODE_ENV === 'development' ? serverConfig?.backend_url_test : serverConfig?.backend_url_server
    let data = {
        processid: processid,
        datajson: datajson
    }
    if(config){
    return axios.post(url, data, config)
    }
    else{
    return axios.post(url, data)
    }
}

export const uploadMedia = (filesArr: any) => {
    try {
     filesArr.map((i: any) => {
        let fData = new FormData();
        fData.append('uploadedFile', i, i?.name);
        let config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
        };
        callApi(processIDs?.upload_media, fData, config)
    })     
    } catch (error) {  
        console.log(`Problem with uploading files: ${error}`);
    }
}