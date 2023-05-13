import { PartialType } from '@nestjs/mapped-types';
import { CreateRestoMenuDto } from './create-resto-menu.dto';

export class UpdateRestoMenuDto extends PartialType(CreateRestoMenuDto) {}
