import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  BadRequestException,
  Response,
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { RestoMenuService } from './resto-menu.service';
import {
  CreateBill,
  CreateRestoMenuDto,
  QueryListMenu,
} from './dto/create-resto-menu.dto';
import { UpdateRestoMenuDto } from './dto/update-resto-menu.dto';
import { Response as Res } from 'express';
import { PageOptionsDto } from './dto/page.dto';

@Controller('resto-menu')
export class RestoMenuController {
  constructor(private readonly restoMenuService: RestoMenuService) {}

  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    console.log(pageOptionsDto);
    return this.restoMenuService.findAll(pageOptionsDto);
  }

  @Get('/list-menu')
  async listMenu(@Query() params: QueryListMenu) {
    const id = await this.restoMenuService.mapping3(params.id);
    const qty = await this.restoMenuService.mapping3(params.qty);
    if (id === null || qty === null) {
      throw new BadRequestException(`not match`);
    }
    const writeMenu = await this.restoMenuService.mapping2(id, qty);
    return {
      message: 'success',
      listMenu: writeMenu,
    };
  }
  @Get('/order-menu')
  findAllOrderMenu() {
    return this.restoMenuService.findOrderMenu();
  }
  @Get('/order-detail')
  findAllOrdersDetail() {
    return this.restoMenuService.findOrdersDetail();
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.restoMenuService.findOnes(+id);
  }
  @Post('/create-bil')
  async createBil(@Body() bil: CreateBill) {
    bil.ormeOrderDate = new Date(Date.now());
    bil.ormeTotalDiscount = '$0.00';
    bil.ormeModifiedDate = new Date(Date.now());

    return this.restoMenuService.createBil(bil);
  }
  @Post()
  async create(@Body() createRestoMenuDto: CreateRestoMenuDto) {
    const cekDuplicate = await this.restoMenuService.findDuplicate({
      where: {
        remeName: createRestoMenuDto.remeName,
      },
    });
    if (cekDuplicate) {
      throw new BadRequestException('Nama Menu sudah di gunakan');
    }
    const test = await this.restoMenuService.regexDollar(
      createRestoMenuDto.remePrice,
    );
    if (test === false) {
      throw new NotAcceptableException('Price not match');
    }
    return this.restoMenuService.create(createRestoMenuDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateRestoMenuDto: UpdateRestoMenuDto,
  ) {
    const menu = await this.restoMenuService.findOnes(+id);
    const test = await this.restoMenuService.regexDollar(
      updateRestoMenuDto.remePrice,
    );
    if (test === false) {
      throw new NotAcceptableException('Price not match');
    }
    return this.restoMenuService.update(menu, updateRestoMenuDto);
  }

  @Delete(':id')
  async remove(
    @Response() res: Res,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Res> {
    await this.restoMenuService.findOnes(+id);
    const deletes = await this.restoMenuService.remove(+id);
    if (deletes.affected === 1) {
      return res.json({ statusCode: 200, message: 'Data succes was delete' });
    }
  }
}
