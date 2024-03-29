export type responseType = {
    status: number | undefined,
    data:{
        returnCode: boolean,
        returnData: any,
        msg: string
    }
}
export type messageType = {
    sender: string,
    message: {
        source: string;
        action: string;
        params: any;
    },
    target: string
}