import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Handle TypeORM query errors
    if (exception instanceof QueryFailedError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: (exception as any).message || "Database query failed",
        path: request.url,
        timestamp: new Date().toISOString(),
        stack:
          process.env.NODE_ENV === "production"
            ? undefined
            : (exception as any).stack,
      });
      return;
    }

    // Handle generic HTTP exceptions
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[];
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === "object" && res !== null && "message" in res) {
        message = (res as any).message;
      } else {
        message = res as string;
      }
    } else {
      message = (exception as any).message || "Internal server error";
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      stack:
        process.env.NODE_ENV === "production"
          ? undefined
          : (exception as any).stack,
      timestamp: new Date().toISOString(),
    });
  }
}
