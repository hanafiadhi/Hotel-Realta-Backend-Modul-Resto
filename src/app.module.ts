import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankService } from './payment/bank/bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestoMenuModule } from './resto/resto-menu/resto-menu.module';
import { UploadModule } from './resto/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
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
    RestoMenuModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, BankService],
})
export class AppModule {}
