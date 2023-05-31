import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankService } from './payment/bank/bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestoMenuModule } from './resto/resto-menu/resto-menu.module';
import { UploadModule } from './resto/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', ''),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'containers-us-west-26.railway.app',
      port: 5860,
      username: 'postgres',
      password: 'uAGOgKAvVlXiNxd2tHg0',
      database: 'railway',
      entities: ['dist/output/entities/*.js'],
      autoLoadEntities: true,
      synchronize: false,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    RestoMenuModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BankService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
