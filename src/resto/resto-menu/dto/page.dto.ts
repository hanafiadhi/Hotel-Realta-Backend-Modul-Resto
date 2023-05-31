import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  IsArray,
  MinLength,
} from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({ minLength: 3 })
  @IsString()
  @IsOptional()
  @MinLength(3)
  search?: string;

  @ApiPropertyOptional({ enum: Order })
  @IsEnum(Order)
  @IsOptional()
  order?: Order;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
  })
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
  @ApiProperty()
  page: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  hasPreviousPage: boolean;

  @ApiProperty()
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

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  data: Array<T>;

  @ApiProperty({ type: () => PageMetaDto })
  meta: PageMetaDto;

  constructor(data: Array<T>, meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
