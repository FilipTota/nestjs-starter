import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from '../prisma/database.service';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(
    private readonly logger: LoggerService,
    private readonly databaseService: DatabaseService,
  ) {}
  async getHello() {
    this.logger.log('Calling log from getHello method', this.context, {
      userId: 123,
      isPremium: true,
    });
    const users = await this.databaseService.user.findMany();
    console.log(users);
    return `Hello World!`;
  }
}
