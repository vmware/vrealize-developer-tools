import { LogLevel } from "./logger";

export abstract class BaseAppender {

  abstract append(severity: LogLevel, message: string);

  format(severity: LogLevel, message: string): string {
    return "this.formatter.format(severity, message);"
  }
}
