import { Injectable } from '@nestjs/common';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoMenuPhotos } from 'output/entities/RestoMenuPhotos';
import { Repository } from 'typeorm';
import { RestoMenuService } from './../resto-menu/resto-menu.service';
import * as fs from 'fs';
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(RestoMenuPhotos)
    private readonly photoRepository: Repository<RestoMenuPhotos>,
    private readonly restoMenuService: RestoMenuService,
  ) {}
  async create(data, req): Promise<boolean | Error> {
    try {
      const Menu = await this.restoMenuService.findOnes(data.menuId);
      const arrayFoto = [];
      for (let index = 0; index < data.images.length; index++) {
        const item = data.images[index];
        const destination = 'restomenuphotos/' + item.fileName;
        const sourceMenu = 'upload/temp/' + item.fileName;
        console.log(destination);
        const newFoto: RestoMenuPhotos = {
          rempPhotoFilename: item.fileName,
          rempPrimary: item.primary ?? 0,
          rempUrl: `${req.protocol}://${req.get(
            'Host',
          )}/upload/temp/${destination}`,
          rempReme: Menu,
          rempThumbnailFilename: Menu.remeName,
          rempId: item.id ?? null,
        };
        console.log(newFoto.rempUrl);
        //pindahkan fotonya ke folder RestoMenu foto
        fs.rename(sourceMenu, destination, function (err) {
          if (err) console.log('ERROR: ' + err);
        });
        console.log(newFoto.rempUrl);
        arrayFoto.push(newFoto);
      }
      await this.photoRepository.save(arrayFoto);
      return true;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.photoRepository.find({
      order: {
        rempId: 'DESC',
      },
      relations: {
        rempReme: true,
      },
    });
  }

  async find(id: number) {
    const Menu = await this.restoMenuService.findOnes(id);
    return await this.photoRepository.find({
      order: {
        rempId: 'DESC',
      },
      where: {
        rempReme: Menu,
      },
    });
  }
  async findOne(id: number) {
    return await this.photoRepository.findOne({
      where: {
        rempId: id,
      },
    });
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action update a #${id} upload`;
  }

  async remove(id: number, data) {
    try {
      const filePath = './restomenuphotos/' + data.rempPhotoFilename;
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log(error.path);
    }
    return await this.photoRepository.delete(id);
  }
}
