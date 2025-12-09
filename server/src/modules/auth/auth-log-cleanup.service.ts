import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, IsNull } from 'typeorm';
import { AuthLog } from './entities/auth-log.entity';

@Injectable()
export class AuthLogCleanupService {
  private readonly logger = new Logger(AuthLogCleanupService.name);

  constructor(
    @InjectRepository(AuthLog)
    private readonly authLogRepository: Repository<AuthLog>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async softDeleteOldLogs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const result = await this.authLogRepository.delete({
      timestamp: LessThan(cutoff),
    });

    if (result.affected && result.affected > 0) {
      this.logger.log(
        `Deleted ${result.affected} auth logs older than 30 days.`,
      );
    } else {
      this.logger.debug('No old logs found.');
    }
  }
}
