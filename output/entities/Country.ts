import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Regions } from './Regions';
import { Proviences } from './Proviences';

@Index('country_id_pk', ['countryId'], { unique: true })
@Index('country_country_name_key', ['countryName'], { unique: true })
@Entity('country', { schema: 'master' })
export class Country {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'country_id' })
  countryId: number;

  @Column('character varying', {
    name: 'country_name',
    nullable: true,
    unique: true,
    length: 35,
  })
  countryName: string | null;

  @ManyToOne(() => Regions, (regions) => regions.countries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'country_region_id', referencedColumnName: 'regionCode' },
  ])
  countryRegion: Regions;

  @OneToMany(() => Proviences, (proviences) => proviences.provCountry)
  proviences: Proviences[];
}
