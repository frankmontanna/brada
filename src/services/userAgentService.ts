import { UAParser } from "ua-parser-js";
export interface UserAgentInfo {
  browser: string;
  device: string;
  os: string;
}
export class UserAgentService {
  private parser: UAParser;
  constructor(userAgent: string) {
    this.parser = new UAParser(userAgent);
  }
  getUserAgentInfo(): UserAgentInfo {
    const browser = this.parser.getBrowser().name || "Unknown";
    const device = this.parser.getDevice().model || "Desktop";
    const os = this.parser.getOS().name || "Unknown";

    return {
      browser,
      device,
      os,
    };
  }
}


