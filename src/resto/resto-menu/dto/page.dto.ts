import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PageDto<T> {
  data: Array<T>;

  meta: PageMetaDto;

  constructor(data: Array<T>, meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsEnum(Order)
  @IsOptional()
  order?: Order;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
export interface PageMetaDtoParameters {
  itemCount: number;
  pageOptionsDto: PageOptionsDto;
}
export class PageMetaDto {
  page: number;

  take: number;

  itemCount: number;

  pageCount: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
