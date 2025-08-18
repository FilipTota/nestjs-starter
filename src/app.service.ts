import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(private readonly logger: LoggerService) {}
  getHello() {
    this.logger.log('Calling log from getHello method', this.context, {
      userId: 123,
      isPremium: true,
    });
    return `Hello World!`;
  }
}
