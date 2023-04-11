import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankService } from './payment/bank/bank.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BankService],
})
export class AppModule {}
