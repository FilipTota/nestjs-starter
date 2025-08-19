import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from '../prisma/database.service';
import { CacheService } from './core/cache/cache.service';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(
    private readonly logger: LoggerService,
    private readonly databaseService: DatabaseService,
    private readonly cache: CacheService,
  ) {}
  async getHello() {
    this.logger.log('Calling log from getHello method', this.context, {
      userId: 123,
      isPremium: true,
    });
    const users = await this.databaseService.user.findMany();
    await this.cache.set('key', `VALUE FROM CACHE`, 1000);
    const valueFromCache = await this.cache.get('key');
    console.log('valueFromCache', valueFromCache);
    console.log(users);
    return `Hello World!`;
  }
}
