import { LogLevel } from "./logger";
export declare abstract class BaseAppender {
    abstract append(severity: LogLevel, message: string): any;
    format(severity: LogLevel, message: string): string;
}
