import { AxiosStatic } from "axios";
import { PluginObject } from "vue/types/plugin";
import { RequestProps } from "./request";
export interface PluginOptions {
    readonly axios: AxiosStatic;
    readonly timeout?: number;
    readonly headers?: Readonly<Record<string, string>>;
}
export declare type RequestFunction = {
    (handler: string, options: RequestProps): () => void;
};
declare const plugin: PluginObject<PluginOptions>;
export default plugin;
declare module "vue/types/vue" {
    interface Vue {
        $october: {
            request: RequestFunction;
        };
    }
}
