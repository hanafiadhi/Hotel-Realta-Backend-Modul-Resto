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
  NotFoundException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
import {
  ApiNotFoundResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

const UPLOAD_DIR = './upload/temp/';
const MAX_UPLOAD_SIZE = 10;
const MAX_FILES_COUNT = 2;

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

  @ApiTags('Upload Menu Resto')
  @Get('resto-menu/foto/:id')
  @ApiResponse({
    status: 200,
    description:
      'send Id Menu nanti akan di carikan foto yang ber id tersebut klo blm ada fotonya akan memberikan empty array saja',
    schema: {
      example: [
        {
          originalName: 'Screenshot 2023-05-26 223845.png',
          fileName: '1685206577920.png',
          imageSrc: 'http://localhost:3000/upload/temp/1685206577920.png',
        },
      ],
    },
  })
  async findMenufoto(@Param('id', ParseIntPipe) id: string) {
    return await this.fileRepository.find(+id);
  }

  @ApiTags('Upload Menu Resto')
  @ApiBody({
    description:
      'silahkan masukan response setelah upload foto dan tambahkan ID menuny juga',
    type: Foto,
  })
  @ApiResponse({
    status: 200,
    description: 'berhasil mengupdate foto untuk menu resto',
    type: Foto,
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Menu with Your ID not found',
        },
      },
    },
  })
  @Patch('resto/photos')
  async savingfoto(
    @Response() res: Res,
    @Req() req: Request,
    @Body() foto: Foto,
  ) {
    const Response = {
      message: 'Yeay Berhasil Menyimpan Foto',
      statusCode: 200,
    };
    await this.fileRepository.create(foto, req);
    return res.status(200).json(Response);
  }

  @ApiTags('Upload Menu Resto')
  @Throttle(3, 60)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: defaultConfig }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Upload Image successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: '201',
        },
        image: {
          type: 'object',
          example: {
            originalName: 'Screenshot 2023-05-26 223845.png',
            fileName: '1685206577920.png',
            imageSrc: 'http://localhost:3000/upload/temp/1685206577920.png',
          },
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    description: 'Upload Image dengan format jpg | jpeg | png',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: '422',
        },
        message: {
          type: 'string',
          example: 'File is Required',
        },
        error: {
          type: 'string',
          example: 'Unprocessable Entity',
        },
      },
    },
  })
  async uploadFile(
    @Response() res: Res,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
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

    return res.json({ statusCode: 201, image });
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

  @ApiTags('Upload Menu Resto')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Berhasil Delete image',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Foto for your menu Not Found',
        },
      },
    },
  })
  @Delete('resto-menu/foto/:id')
  async remove(
    @Response() res: Res,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Res> {
    const data = await this.fileRepository.findOne(+id);
    if (!data) {
      throw new NotFoundException('id not Found');
    }
    const deletes = await this.fileRepository.remove(+id, data);
    if (deletes.affected === 1) {
      return res.json({ statusCode: 200, message: 'Berhasil Delete image' });
    }
  }
}
