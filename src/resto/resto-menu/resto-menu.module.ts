import { Module } from '@nestjs/common';
import { RestoMenuService } from './resto-menu.service';
import { RestoMenuController } from './resto-menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { RestoMenus } from 'output/entities/RestoMenus';
import { CacheModule } from '@nestjs/cache-manager';
import { OrderMenuDetail } from 'output/entities/OrderMenuDetail';
import { OrderMenus } from 'output/entities/OrderMenus';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([RestoMenus, OrderMenuDetail, OrderMenus]),
  ],
  controllers: [RestoMenuController],
  providers: [RestoMenuService],
  exports: [RestoMenuService],
})
export class RestoMenuModule {}
