import {
  Post,
  UploadedFile,
  UseInterceptors,
  Controller,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
  Body,
  ParseIntPipe,
  Param,
  Response,
  Req,
  Get,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FileValidator } from '@nestjs/common';
import { UploadService } from './upload.service';
import { of } from 'rxjs';
import { join } from 'path';
import { Foto } from './dto/create-upload.dto';

const UPLOAD_DIR = './upload/temp/';
const MAX_UPLOAD_SIZE = 10; // in MB
const MAX_FILES_COUNT = 2; // Maximum number of files that can be uploaded at once

// User interface of the authenticated user
interface PrepareFile {
  id: number;
  moduleNama: string;
  files: Array<Files>;
}
interface Files {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

class MaxFileSize extends FileValidator<{ maxSize: number }> {
  constructor(options: { maxSize: number }) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    const in_mb = file.size / 1000000;
    return in_mb <= this.validationOptions.maxSize;
  }
  buildErrorMessage(): string {
    return `File uploaded is too big. Max size is (${this.validationOptions.maxSize} MB)`;
  }
}

const defaultConfig = diskStorage({
  destination: UPLOAD_DIR,
  filename: (req: Request, file, cb) => {
    const date = Date.now();
    cb(null, `${date}${path.extname(file.originalname)}`);
  },
});

@Controller('images')
export class UploadController {
  constructor(private fileRepository: UploadService) {}
  @Get('resto/getAllPhoto')
  async getAll() {
    return await this.fileRepository.findAll();
  }
  @Get('resto-menu/foto/:id')
  async findMenufoto(@Param('id', ParseIntPipe) id: string) {
    return await this.fileRepository.find(+id);
  }
  @Patch('resto/photos')
  async savingfoto(@Response() res: Res, @Body() foto: Foto) {
    const Response = {
      message: 'Yeay Berhasil Menyimpan Foto',
      statusCode: 200,
    };
    await this.fileRepository.create(foto);
    return res.status(200).json(Response);
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: defaultConfig }))
  async uploadFile(
    @Response() res: Res,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addValidator(
          new MaxFileSize({
            maxSize: MAX_UPLOAD_SIZE,
          }),
        )
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Res> {
    const image = {
      originalName: file.originalname,
      fileName: file.filename,
      imageSrc: `${req.protocol}://${req.get('Host')}/upload/temp/${
        file.filename
      }`,
    };
    return res.json({ message: 'success', image });
    // return of(
    //   res.sendFile(join(process.cwd(), `/upload/temp/${file.filename}`)),
    // );
  }

  @Post('upload/multiple')
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES_COUNT, { storage: defaultConfig }),
  )
  async uploadFiles(
    @Param()
    @Body('id', ParseIntPipe)
    id: string,
    @Body('module') nama: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addValidator(
          new MaxFileSize({
            maxSize: MAX_UPLOAD_SIZE,
          }),
        )
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
    const newData: PrepareFile = {
      id: +id,
      moduleNama: nama,
      files: files,
    };
    // return this.fileRepository.create(newData);
    return newData;
  }
  @Delete('resto-menu/foto/:id')
  async remove(
    @Response() res: Res,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Res> {
    const data = await this.fileRepository.findOne(+id);
    if (!data) {
      throw new BadRequestException('id not Found');
    }
    const deletes = await this.fileRepository.remove(+id, data);
    if (deletes.affected === 1) {
      return res.json({ statusCode: 200, message: 'Berhasil Delete image' });
    }
  }
}
