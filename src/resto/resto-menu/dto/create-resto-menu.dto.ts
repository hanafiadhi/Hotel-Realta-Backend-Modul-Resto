import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  Contains,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum Spesial {
  AVAILABLE = 'AVAILABLE',
}

export class CreateRestoMenuDto {
  @ApiProperty({
    description: 'Menu Resto itu required dan harus unique',
    minLength: 3,
    maxLength: 55,
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Resto Menu Is Required',
  })
  @IsString({ message: 'Resto Menu Must Be String' })
  @MinLength(3, {
    message: 'Resto Menu To Short',
  })
  @MaxLength(55, {
    message: 'Resto Menu To Long',
  })
  remeName: string | null;

  @IsNotEmpty({
    message: 'Description Is Required',
  })
  @MinLength(5, {
    message: 'Desccription To Short',
  })
  @MaxLength(255, {
    message: 'Description To Long',
  })
  @ApiProperty({
    description: 'desciption menu bebas yang ',
    minLength: 5,
    maxLength: 255,
    type: String,
  })
  remeDescription: string | null;

  @ApiProperty({
    description: 'Contoh Harganya $9000.00 dan harus ada simbol $',
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Price Is Required',
  })
  @Contains('$', { message: 'Price must have $ (dollar)' })
  remePrice: string | null;

  @ApiProperty({
    enum: Spesial,
    description: 'remeStatus is Optional tapi ketika di isi harus AVAILABLE',
    required: false,
  })
  // @ApiPropertyOptional({ description: 'optional' })
  @IsEnum(Spesial)
  @IsOptional()
  remeStatus?: Spesial;

  remeModifiedDate: Date;
}

export class CreateMenuDetail {
  @ApiProperty({
    description: 'ID dari Menu',
    minimum: 1,
  })
  @IsNotEmpty({ message: 'ID is Required' })
  @IsPositive({ message: 'ID must positif' })
  @IsInt({ message: 'ID must be integer' })
  omdeId?: number;

  ormePrice?: string | null;

  @ApiProperty({
    description: 'jumlah quantity menu yang di pesan',
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Qty is Required' })
  @IsPositive({ message: 'ID must positif' })
  @IsInt({ message: 'ID must be integer' })
  ormeQty?: number | null;

  ormeSubtotal?: string | number;
  ormeDiscount?: string | null;
  omdeReme?: number;
}

export class QueryListMenu {
  @IsNotEmpty({ message: 'ID is Required' })
  id: string | Array<string>;
  @IsNotEmpty({ message: 'qty is Required' })
  qty: string | Array<string>;
}
export class CreateBill {
  ormeOrderNumber: string | null;
  ormeOrderDate: Date | null;
  ormeTotalItem: number | null;
  ormeTotalDiscount: string | null;
  ormeTotalAmount: string | null | number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Pay Type is Required' })
  @IsString({ message: 'Pay Type is mus string' })
  @MaxLength(2, {
    message: 'Pay Type is Max',
  })
  ormePayType: string | null;

  @ApiProperty()
  @IsNotEmpty({ message: 'Card Number is Required' })
  @IsString({ message: 'Card Number is mus string' })
  @MinLength(7, {
    message: 'Card Number must more than 7',
  })
  @MaxLength(25, {
    message: 'Card Number is Max',
  })
  ormeCardnumber: string | null;

  @ApiProperty()
  @IsNotEmpty({ message: 'Paid Type is Required' })
  @IsString({ message: 'Paid Type is mus string' })
  @MaxLength(2, {
    message: 'Paid Type is max',
  })
  ormeIsPaid: string | null;
  ormeModifiedDate: Date | null;
  ormeUserId: number | null;

  @ApiProperty({ type: [CreateMenuDetail] })
  @IsNotEmpty({
    message: 'List Menu is required',
  })
  @ArrayNotEmpty({
    message: 'silahkan pilih menu terlebih dahulu',
  })
  @ValidateNested()
  @Type(() => CreateMenuDetail)
  listMenu?: Array<CreateMenuDetail>;
}

export class ListMenu {
  @IsNotEmpty({
    message: 'List Menu is required',
  })
  @ArrayNotEmpty({
    message: 'silahkan pilih menu terlebih dahulu',
  })
  @ValidateNested()
  @Type(() => CreateMenuDetail)
  listMenu: Array<CreateMenuDetail>;
}

export class Query {
  search: string;
  price: string;
  take: number;
  limit: number;
  page: number;
}
