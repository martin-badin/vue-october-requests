import { AxiosInstance } from "axios";
export interface SuccessResponse {
    readonly X_OCTOBER_REDIRECT: string;
}
export interface ErrorResponse {
    readonly X_OCTOBER_ERROR_FIELDS: Readonly<Record<string, string>>;
    readonly X_OCTOBER_ERROR_MESSAGE: string;
}
export interface RequestProps {
    readonly formData: FormData | null;
    readonly onError?: (value: any) => void;
    readonly onLoading?: (value: boolean) => void;
    readonly onSuccess?: (value: any) => void;
    readonly prevent: boolean;
    readonly redirect?: string;
}
export declare const ERROR_MESSAGES: {
    "handler.required": string;
    "handler.invalid": string;
    "formData.invalid": string;
    "event.not.defined": (value: string) => string;
};
interface Props {
    readonly handler: string;
    readonly instance: AxiosInstance;
}
export declare function request({ formData, instance, handler, redirect, ...bag }: RequestProps & Props): void;
export {};
