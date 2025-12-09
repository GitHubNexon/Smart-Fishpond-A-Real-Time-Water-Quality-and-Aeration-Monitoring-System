// src/common/middleware/maintenance.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

    // allow certain routes if needed (e.g. health check)
    const allowedRoutes = ['/api/health', '/api'];

    if (isMaintenance && !allowedRoutes.includes(req.path)) {
      return res.status(503).json({
        message:
          'The system is currently under maintenance. Please try again later.',
      });
    }

    next();
  }
}
