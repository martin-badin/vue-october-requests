import { AxiosInstance } from "axios";
export interface SuccessResponse {
    readonly X_OCTOBER_REDIRECT: string;
}
export interface ErrorResponse {
    readonly X_OCTOBER_ERROR_FIELDS: Readonly<Record<string, string>>;
    readonly X_OCTOBER_ERROR_MESSAGE: string;
}
export interface RequestProps {
    readonly formData: FormData;
    readonly handler: string;
    readonly instance: AxiosInstance;
    readonly onError?: (value: any) => void;
    readonly onLoading?: (value: boolean) => void;
    readonly onSuccess?: (value: any) => void;
    readonly prevent: boolean;
    readonly redirect?: string;
}
export declare type RequestFunction = {
    (options: RequestProps): () => void;
};
export declare function request({ formData, handler, instance, redirect, ...bag }: RequestProps): void;
