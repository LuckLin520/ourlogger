declare class Logger {
    private static showLogger;
    private static allowApis;
    private static store;
    private static getStackTrace;
    private static saveLog;
    static log(...args: unknown[]): Promise<string>;
    static export(): Promise<void>;
    static setShowLogger(showLogger: boolean): void;
    static apiLog(data: any, url: string, payload: any): Promise<string>;
    static setAllowApis(apis: string[]): void;
}
export declare interface Window {
    Logger: Logger;
}
export default Logger;
