import { RequestProps } from "../src/request";
import { AxiosInstance } from "axios";
export declare const options: RequestProps & {
    readonly handler: string;
    readonly instance: AxiosInstance;
};
