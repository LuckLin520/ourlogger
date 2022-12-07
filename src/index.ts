/*
 * @Author: 赵治林
 * @Description: "控制台日志输出类"
 * @Date: 2022-11-14 14:08:55
 * @Last Modified by: 赵治林
 * @Last Modified time: 2022-12-07 11:32:08
 */
import IndexStore from "./IndexStore";
import { downloadFile, formatTimestamp } from "./util";

class Logger {
  private static showLogger = sessionStorage.showLogger === "true";

  private static allowApis: string[] = sessionStorage.allowApis
    ? JSON.parse(sessionStorage.allowApis)
    : [];

  private static store = new IndexStore();

  private static getStackTrace(callMethod: any) {
    const obj: { stack?: string } = {};
    (Error as any).captureStackTrace(obj, callMethod);
    const urlString =
      /(?<urlString>http:\/\/\S+\d+:\d+).*/u.exec(obj.stack!)?.groups
        ?.urlString || "";
    if (!urlString) {
      return "[-]";
    }
    const url = new URL(urlString);
    const { pathname } = url;
    const urlSplitArr = url.searchParams.get("t")?.split(":") || [];
    const time = formatTimestamp(Number(urlSplitArr[0]));
    const lineStr = `${urlSplitArr[1]}:${urlSplitArr[2]}`;
    return `[${time}][${pathname}][${lineStr}]`;
  }

  private static async saveLog(...args: unknown[]): Promise<string> {
    const row = await Logger.store.get("Logger.log");
    let temStr = row?.content || "";
    let currentStr = "";
    args.forEach((v) => {
      if (typeof v === "object") {
        currentStr += `${JSON.stringify(v)} `;
      } else {
        currentStr += `${v} `;
      }
    });
    temStr = (temStr + currentStr).slice(0, -1);
    const nextRow = {
      id: "Logger.log",
      content: `${temStr}\n`,
    };
    if (row) {
      Logger.store.put(nextRow);
    } else {
      Logger.store.add(nextRow);
    }
    return currentStr;
  }

  public static async log(...args: unknown[]) {
    const stackInfo = Logger.getStackTrace(Logger.log);
    if (Logger.showLogger) {
      // eslint-disable-next-line no-console
      console.log(`%c${stackInfo}:\n`, "color:blue", ...args);
    }
    return Logger.saveLog(stackInfo, ...args);
  }

  public static async export() {
    const row = await Logger.store.get("Logger.log");
    const content = row?.content;
    if (content) {
      const blob = new Blob([content], { type: "text/plain" });
      downloadFile(window.URL.createObjectURL(blob), "邮件系统前端日志文件");
    }
  }

  public static setShowLogger(showLogger: boolean) {
    Logger.showLogger = showLogger;
    sessionStorage.showLogger = showLogger;
  }

  public static async apiLog(data: any, url: string, payload: any) {
    const stackInfo = Logger.getStackTrace(Logger.apiLog);
    if (Logger.allowApis.some((v) => url.includes(v))) {
      // eslint-disable-next-line no-console
      console.log(
        `%c${stackInfo}:\n`,
        "color:blue",
        `${url} RequestParam:\n`,
        payload,
        `\n ${url} ResponseData:\n`,
        data
      );
    }
    return Logger.saveLog(stackInfo, `ResponseData ${url}:\n`, data);
  }

  public static setAllowApis(apis: string[]) {
    if (!apis) {
      throw Error("require 1 array params!");
    }
    Logger.allowApis = apis;
    sessionStorage.allowApis = JSON.stringify(Logger.allowApis);
  }
}
export declare interface Window {
  Logger: Logger
}
(window as unknown as Window).Logger = Logger;

export default Logger;
