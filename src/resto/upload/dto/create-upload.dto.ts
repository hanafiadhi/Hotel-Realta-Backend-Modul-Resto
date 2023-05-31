import {
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class Upload {}

export class Image {
  @ApiPropertyOptional({
    default: null,
    description: 'untuk menambahkan foto baru id nya tidak perlu di masukan',
  })
  @ValidateIf((object, value) => value !== null)
  id?: number;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 1,
    default: 0,
  })
  @ValidateIf((object, value) => value !== null)
  primary?: number | 0;

  @ApiProperty()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  imageSrc: string;
}
export class Foto {
  @ApiProperty()
  @IsNotEmpty()
  menuId: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'List Menu is required',
  })
  @ArrayNotEmpty({
    message: 'silahkan pilih menu terlebih dahulu',
  })
  @ApiProperty({ type: [Image] })
  @ValidateNested()
  @Type(() => Image)
  images: Array<Image>;
}

export class CreateUploadDto {}
export interface PrepareFile {
  id: number;
  moduleNama: string;
  files: Array<Files>;
}
export interface Files {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
