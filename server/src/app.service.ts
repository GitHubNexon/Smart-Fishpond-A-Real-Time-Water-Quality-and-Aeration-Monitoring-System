import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "MAIN SERVER IS RUNNING | Go to /api/health to check server health";
  }
}
