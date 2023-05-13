import {
  Inject,
  Injectable,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateBill,
  CreateMenuDetail,
  CreateRestoMenuDto,
  ListMenu,
} from './dto/create-resto-menu.dto';
import { UpdateRestoMenuDto } from './dto/update-resto-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoMenus } from 'output/entities/RestoMenus';
import { Repository, DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
import { OrderMenuDetail } from 'output/entities/OrderMenuDetail';
import { OrderMenus } from 'output/entities/OrderMenus';
import { PageDto, PageMetaDto, PageOptionsDto } from './dto/page.dto';

@Injectable()
export class RestoMenuService {
  constructor(
    @InjectRepository(RestoMenus)
    private readonly restoRespository: Repository<RestoMenus>,
    @InjectRepository(OrderMenuDetail)
    private oMDetailRepo: Repository<OrderMenuDetail>,
    @InjectRepository(OrderMenus) private oMenuRepo: Repository<OrderMenus>,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
    private dataSource: DataSource,
  ) {}
  findDuplicate(obj: object): Promise<boolean> {
    return this.restoRespository.exist(obj);
  }

  async regexDollar(price: string) {
    const regex = new RegExp(/\$[\d{1,3}(,\d{3})]*\.\d{2}/);
    const hasil = regex.test(price);
    return hasil;
  }

  async create(createRestoMenuDto: CreateRestoMenuDto) {
    createRestoMenuDto.remeModifiedDate = new Date(Date.now());
    let status = createRestoMenuDto.remeStatus;

    if (status != 'AVAILABLE') {
      status = null;
    }

    const newMenu = await this.restoRespository.create(createRestoMenuDto);
    await this.cacheManager.del('restoCaching');
    return await this.restoRespository.save(newMenu);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryDB = await this.restoRespository.createQueryBuilder(
      'resto_menus',
    );

    if (pageOptionsDto.order) {
      queryDB.orderBy('resto_menus.remePrice', pageOptionsDto.order);
    } else {
      queryDB.orderBy('resto_menus.remeId', 'DESC');
    }
    if (pageOptionsDto.search) {
      queryDB.where('resto_menus.remeName Ilike :name', {
        name: `%${pageOptionsDto.search}%`,
      });
    }
    console.log(pageOptionsDto.skip);
    console.log(pageOptionsDto.take);
    queryDB.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryDB.getCount();
    const { entities } = await queryDB.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(entities, pageMetaDto);
  }

  async findOnes(id: number): Promise<RestoMenus | null> {
    try {
      const data = await this.restoRespository.findOne({
        where: {
          remeId: id,
        },
      });
      if (!data) {
        throw Error;
      }
      return data;
    } catch (error) {
      throw new BadRequestException(`Menu with id ${id} not found`);
    }
  }

  async update(
    menu: RestoMenus,
    updateRestoMenuDto: UpdateRestoMenuDto,
  ): Promise<RestoMenus | never> {
    await this.cacheManager.del('restoCaching');
    Object.assign(menu, updateRestoMenuDto);
    return this.restoRespository.save(menu);
  }

  async remove(id: number) {
    await this.cacheManager.del('restoCaching');
    return this.restoRespository.delete(id);
  }
  findOrderMenu(id?: number) {
    return this.oMenuRepo.find({
      where: { ormeId: id },
      relations: {
        orderMenuDetails: true,
      },
      order: { ormeId: 'DESC' },
    });
  }
  findOrdersDetail() {
    return this.oMDetailRepo.find({
      relations: {
        omdeOrme: true,
        omdeReme: true,
      },
    });
  }

  async createOrderNumber(): Promise<string> {
    const serial = await this.oMenuRepo.find({
      order: {
        ormeId: 'DESC',
      },
      take: 1,
    });
    let text = serial[0].ormeOrderNumber;

    const regex = /MENUS#\d{8}-(\d{4})/;
    const match = regex.exec(text);
    let data = parseInt(match[1], 10);
    data++;

    const datas = data.toString().padStart(4, '0');
    text = text.replace(match[1], datas);
    const regexs = /MENUS#(\d{8})-\d{4}/;
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const matchs = regexs.exec(text);
    const newDate = `${year}${month}${day}`;
    text = text.replace(matchs[1], newDate);
    return text;
  }
  async mapping2(
    id: Array<number>,
    qty: Array<number>,
  ): Promise<CreateMenuDetail[]> {
    const pilihan: ListMenu = {
      listMenu: [],
    };

    //cek agar id sama qty sama
    if (id.length !== qty.length) {
      throw new BadRequestException(`not match`);
    }
    for (let index = 0; index <= id.length - 1; index++) {
      //true
      const cekID = await this.findOnes(id[index]);
      let Subtotal: number | string = cekID.remePrice.replace(/[$]/g, '');
      Subtotal = parseFloat(Subtotal) * qty[index];

      Subtotal.toString();
      const listMenus: CreateMenuDetail = {
        omdeId: id[index],
        ormePrice: cekID.remePrice,
        ormeQty: qty[index],
        ormeSubtotal: Subtotal,
      };
      //sebelum di push cek dulu ada id yang sama tidak kalau ada di gabungin
      pilihan.listMenu.push(listMenus);
    }
    const result = pilihan.listMenu.reduce((acc, curr) => {
      const existingItem = acc.find((item) => item.omdeId === curr.omdeId);
      if (existingItem) {
        existingItem.ormeQty += curr.ormeQty;
        existingItem.ormeSubtotal += curr.ormeSubtotal;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
    result.map((val) => (val.ormeSubtotal = `$${val.ormeSubtotal},000.00`));

    return result;
  }
  async mapping3(data: string | Array<string>): Promise<Array<number>> {
    const change: Array<number> = [];
    if (Array.isArray(data)) {
      const numArray = data.map((str) => str.split(',')).flat();
      for (let index = 0; index < numArray.length; index++) {
        const convert = parseInt(numArray[index]);
        if (Number.isNaN(convert)) {
          return null;
        }
        change.push(convert);
      }
    } else {
      const temp = data.split(',');
      for (let index = 0; index < temp.length; index++) {
        const convert = parseInt(temp[index]);
        if (Number.isNaN(convert)) {
          return null;
        }
        change.push(convert);
      }
    }
    return change;
  }
  async chooseMenu(data: CreateBill) {
    data.ormeTotalAmount = 0;
    data.ormeTotalItem = 0;
    for (let index = 0; index <= data.listMenu.length - 1; index++) {
      //true
      const perItem = data.listMenu[index];
      const id = data.listMenu[index]['omdeId'];
      const qty = data.listMenu[index]['ormeQty'];
      const cekID = await this.findOnes(id);
      let Subtotal: number | string = cekID.remePrice.replace(/[$]/g, '');
      Subtotal = parseFloat(Subtotal) * qty;
      data.ormeTotalAmount += Subtotal;
      Subtotal.toString();
      perItem.ormePrice = cekID.remePrice;
      perItem.ormeSubtotal = Subtotal;
      data.ormeTotalItem++;
    }
    data.ormeTotalAmount.toString();
    data.ormeTotalItem.toString();
    return data;
  }
  async createBil(bil: CreateBill) {
    try {
      const orderNumber = await this.createOrderNumber();

      bil.ormeOrderNumber = orderNumber;
      await this.chooseMenu(bil);
      const newOrder: OrderMenus = {
        ormeOrderNumber: orderNumber,
        ormeOrderDate: bil.ormeOrderDate,
        ormeTotalItem: bil.ormeTotalItem,
        ormeCardnumber: bil.ormeCardnumber,
        ormeTotalAmount: bil.ormeTotalAmount.toString(),
        ormeIsPaid: bil.ormeIsPaid,
        ormePayType: bil.ormePayType,
        ormeModifiedDate: bil.ormeModifiedDate,
        ormeTotalDiscount: bil.ormeTotalDiscount,
        ormeUserId: 2,
      };
      return await this.transaction(newOrder, bil.listMenu);
    } catch (error) {
      return error;
    }
  }
  async transaction(data, data2) {
    const response = {
      message: 'Failed',
      success: false,
      data: {},
    };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = new OrderMenus();
      order.ormeOrderNumber = data.ormeOrderNumber;
      order.ormeOrderDate = data.ormeOrderDate;
      order.ormeTotalItem = data.ormeTotalItem;
      order.ormeCardnumber = data.ormeCardnumber;
      order.ormeTotalAmount = data.ormeTotalAmount.toString();
      order.ormeIsPaid = data.ormeIsPaid;
      order.ormePayType = data.ormePayType;
      order.ormeModifiedDate = data.ormeModifiedDate;
      order.ormeTotalDiscount = data.ormeTotalDiscount;
      order.ormeUserId = 2;
      const saving1 = await queryRunner.manager.save(order);
      const list: Array<OrderMenuDetail> = [];
      for (let index = 0; index < data2.length; index++) {
        const item = data2[index];
        const cekID = await this.findOnes(item.omdeId);
        const listMenus: OrderMenuDetail = {
          ormePrice: item.ormePrice,
          ormeQty: item.ormeQty,
          ormeDiscount: '$0.00',
          ormeSubtotal: item.ormeSubtotal.toString(),
          omdeReme: cekID,
          omdeOrme: saving1,
        };
        list.push(listMenus);
      }
      const creating2 = this.oMDetailRepo.create(list);

      await queryRunner.manager.save(creating2);

      await queryRunner.commitTransaction();
      response.success = true;
      response.message = 'Yeay Pesanan berhasil di Buat';
      response.data = await this.findOrderMenu(saving1.ormeId);
      return response;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: err?.message,
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
