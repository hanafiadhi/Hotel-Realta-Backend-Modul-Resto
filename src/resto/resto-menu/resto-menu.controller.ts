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
import { PageDto, PageOptionsDto } from './dto/page.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RestoMenu } from './entities/resto-menu.entity';
import { Throttle } from '@nestjs/throttler';

@Controller('resto-menu')
export class RestoMenuController {
  constructor(private readonly restoMenuService: RestoMenuService) {}

  @Throttle(3, 60)
  @ApiTags('Resto Menu')
  @Get()
  @ApiResponse({
    status: 200,
    description:
      'akan menampilkan data mulai dari data terbaru sampe limit 10, bisa juga ke page selanjutnya atau query yang sudah di sediakan',
    type: PageDto,
  })
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
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

  @ApiTags('Order Bil')
  @Get('/order-menu/:id')
  async findAllOrderMenu(@Param('id', ParseIntPipe) id: string) {
    return await this.restoMenuService.findOrderMenu(+id);
  }

  @Get('/order-detail')
  findAllOrdersDetail() {
    return this.restoMenuService.findOrdersDetail();
  }
  @ApiTags('Resto Menu')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.restoMenuService.findOnes(+id);
  }

  @ApiTags('Order Bil')
  @ApiCreatedResponse({
    description: 'create order succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        success: {
          type: 'boolean',
        },
        data: {
          type: 'array',
          example: {
            ormeId: 450,
            ormeOrderNumber: 'MENUS#20230528-0234',
            ormeOrderDate: '2023-05-28T04:13:37.312Z',
            ormeTotalItem: 1,
            ormeTotalDiscount: '$0.00',
            ormeTotalAmount: '$12.00',
            ormePayType: 'BO',
            ormeCardnumber: '1221212',
            ormeIsPaid: 'P ',
            ormeModifiedDate: '2023-05-28T04:13:37.312Z',
            ormeUserId: 2,
            orderMenuDetails: [
              {
                omdeId: 634,
                ormePrice: '$12,000.00',
                ormeQty: 1,
                ormeSubtotal: '$12.00',
                ormeDiscount: '$0.00',
              },
            ],
          },
        },
      },
    },
  })
  @Post('/create-bil')
  async createBil(@Body() bil: CreateBill) {
    bil.ormeOrderDate = new Date(Date.now());
    bil.ormeTotalDiscount = '$0.00';
    bil.ormeModifiedDate = new Date(Date.now());

    return this.restoMenuService.createBil(bil);
  }

  @ApiTags('Resto Menu')
  @ApiCreatedResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RestoMenu,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'check your request' })
  @ApiBody({ type: CreateRestoMenuDto })
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

  @ApiTags('Resto Menu')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiBody({
    description:
      'silahkan masukan datanya sesuai field yang ada jangan lupa juga id nya di param yang sudah disediakan',
    type: CreateRestoMenuDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'The record has been successfully update dan coba cek validationnya seperti create menu',
    schema: {
      type: 'object',
      properties: {
        remeId: {
          type: 'number',
          example: '123',
        },
        remeName: {
          type: 'string',
          example: 'Green Goblin',
        },
        remeDescription: {
          type: 'string',
          example: 'Yo Ndak tau kok tanya saya',
        },
        remePrice: {
          type: 'string',
          example: '$0,000.00',
        },
        remeStatus: {
          type: 'string',
          example: 'Available atau Null',
        },
        remeModifiedDate: {
          type: 'string',
          example: '2023-05-27T08:52:01.751Z',
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
          example: 'Menu with Your ID Not Found',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'validation error jika tidak sesuai',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          // type: 'array',
          example: ['Resto Menu To Short', 'Price must have $ (dollar)'],
        },
      },
    },
  })
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

  @ApiTags('Resto Menu')
  @ApiParam({
    name: 'id',
    type: String,
  })
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
          example: 'Data succes was delete',
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
          example: 'Menu with Your ID Not Found',
        },
      },
    },
  })
  @Delete(':id')
  async remove(
    @Response() res: Res,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<any> {
    await this.restoMenuService.findOnes(+id);
    const deletes = await this.restoMenuService.remove(+id);
    if (deletes.affected === 1) {
      return res.json({ statusCode: 200, message: 'Data succes was delete' });
    }
  }
}
