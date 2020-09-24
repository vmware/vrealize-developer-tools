import { BaseAppender } from "./appender";

export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

export interface LogMessageProvider {
  (): string;
}

export default BaseAppender;
