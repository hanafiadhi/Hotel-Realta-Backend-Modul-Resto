import { Type } from 'class-transformer';
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
  remeDescription: string | null;

  @IsNotEmpty({
    message: 'Price Is Required',
  })
  @Contains('$', { message: 'Price must have $ (dollar)' })
  remePrice: string | null;
  @IsEnum(Spesial)
  @IsOptional()
  remeStatus?: Spesial;

  remeModifiedDate: Date;
}

export class CreateMenuDetail {
  @IsNotEmpty({ message: 'ID is Required' })
  @IsPositive({ message: 'ID must positif' })
  @IsInt({ message: 'ID must be integer' })
  omdeId?: number;
  ormePrice?: string | null;
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
  @IsNotEmpty({ message: 'Pay Type is Required' })
  @IsString({ message: 'Pay Type is mus string' })
  @MaxLength(2, {
    message: 'Pay Type is Max',
  })
  ormePayType: string | null;
  @IsNotEmpty({ message: 'Card Number is Required' })
  @IsString({ message: 'Card Number is mus string' })
  @MinLength(7, {
    message: 'Card Number must more than 7',
  })
  @MaxLength(25, {
    message: 'Card Number is Max',
  })
  ormeCardnumber: string | null;
  @IsNotEmpty({ message: 'Paid Type is Required' })
  @IsString({ message: 'Paid Type is mus string' })
  @MaxLength(2, {
    message: 'Paid Type is max',
  })
  ormeIsPaid: string | null;
  ormeModifiedDate: Date | null;
  ormeUserId: number | null;
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
