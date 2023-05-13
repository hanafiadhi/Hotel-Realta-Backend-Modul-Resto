import {
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
export class Upload {}

export class Foto {
  @IsNotEmpty()
  menuId: number;
  @IsNotEmpty({
    message: 'List Menu is required',
  })
  @ArrayNotEmpty({
    message: 'silahkan pilih menu terlebih dahulu',
  })
  @ValidateNested()
  @Type(() => Image)
  images: Array<Image>;
}
class Image {
  @ValidateIf((object, value) => value !== null)
  id?: number;
  @ValidateIf((object, value) => value !== null)
  primary?: number | 0;
  @IsNotEmpty()
  originalName: string;
  @IsNotEmpty()
  fileName: string;
  @IsNotEmpty()
  imageSrc: string;
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
