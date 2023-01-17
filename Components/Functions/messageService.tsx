import { Subject } from "rxjs";

const subject = new Subject();
export type messageParams = {
    source: string
    action: string
    params: any
}

export const messageService = {
    sendMessage: (
        sender: string,
        message: messageParams, 
        target: string
    ) => subject.next({
        sender: sender,
        message: message,
        target: target
    }),
    onReceive: () => subject.asObservable(),
    clearMessage: () => subject.next({})
}