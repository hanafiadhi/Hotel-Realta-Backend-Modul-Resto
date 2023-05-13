import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { RestoMenuPhotos } from 'output/entities/RestoMenuPhotos';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

import { RestoMenuModule } from '../resto-menu/resto-menu.module';
@Module({
  imports: [TypeOrmModule.forFeature([RestoMenuPhotos]), RestoMenuModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
