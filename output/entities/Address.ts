import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Proviences } from "./Proviences";
import { Hotels } from "./Hotels";

@Index("addr_id_pk", ["addrId"], { unique: true })
@Entity("address", { schema: "master" })
export class Address {
  @PrimaryGeneratedColumn({ type: "integer", name: "addr_id" })
  addrId: number;

  @Column("character varying", {
    name: "addr_line1",
    nullable: true,
    length: 225,
  })
  addrLine1: string | null;

  @Column("character varying", {
    name: "addr_line2",
    nullable: true,
    length: 225,
  })
  addrLine2: string | null;

  @Column("character varying", {
    name: "addr_postal_code",
    nullable: true,
    length: 5,
  })
  addrPostalCode: string | null;

  @Column("json", { name: "addr_spatial_location", nullable: true })
  addrSpatialLocation: object | null;

  @ManyToOne(() => Proviences, (proviences) => proviences.addresses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "addr_prov_id", referencedColumnName: "provId" }])
  addrProv: Proviences;

  @OneToMany(() => Hotels, (hotels) => hotels.hotelAddr)
  hotels: Hotels[];
}
