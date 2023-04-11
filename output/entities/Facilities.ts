import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BookingOrderDetail } from "./BookingOrderDetail";
import { CategoryGroup } from "./CategoryGroup";
import { Hotels } from "./Hotels";
import { FacilityPhoto } from "./FacilityPhoto";
import { FacilityPriceHistory } from "./FacilityPriceHistory";
import { RestoMenus } from "./RestoMenus";
import { WorkOrderDetail } from "./WorkOrderDetail";

@Index("pk_faci_id", ["faciId"], { unique: true })
@Index("facilities_faci_room_number_key", ["faciRoomNumber"], { unique: true })
@Entity("facilities", { schema: "hotel" })
export class Facilities {
  @PrimaryGeneratedColumn({ type: "integer", name: "faci_id" })
  faciId: number;

  @Column("character varying", {
    name: "faci_name",
    nullable: true,
    length: 125,
  })
  faciName: string | null;

  @Column("character varying", {
    name: "faci_description",
    nullable: true,
    length: 255,
  })
  faciDescription: string | null;

  @Column("integer", { name: "faci_max_number", nullable: true })
  faciMaxNumber: number | null;

  @Column("character varying", {
    name: "faci_measure_unit",
    nullable: true,
    length: 15,
  })
  faciMeasureUnit: string | null;

  @Column("character varying", {
    name: "faci_room_number",
    nullable: true,
    unique: true,
    length: 6,
  })
  faciRoomNumber: string | null;

  @Column("timestamp without time zone", {
    name: "faci_startdate",
    nullable: true,
  })
  faciStartdate: Date | null;

  @Column("timestamp without time zone", {
    name: "faci_enddate",
    nullable: true,
  })
  faciEnddate: Date | null;

  @Column("money", { name: "faci_low_price", nullable: true })
  faciLowPrice: string | null;

  @Column("money", { name: "faci_high_price", nullable: true })
  faciHighPrice: string | null;

  @Column("money", { name: "faci_rate_price", nullable: true })
  faciRatePrice: string | null;

  @Column("money", { name: "faci_discount", nullable: true })
  faciDiscount: string | null;

  @Column("money", { name: "faci_tax_rate", nullable: true })
  faciTaxRate: string | null;

  @Column("timestamp without time zone", {
    name: "faci_modified_date",
    nullable: true,
  })
  faciModifiedDate: Date | null;

  @OneToMany(
    () => BookingOrderDetail,
    (bookingOrderDetail) => bookingOrderDetail.bordeFaci
  )
  bookingOrderDetails: BookingOrderDetail[];

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.facilities, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "faci_cagro_id", referencedColumnName: "cagroId" }])
  faciCagro: CategoryGroup;

  @ManyToOne(() => Hotels, (hotels) => hotels.facilities, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "faci_hotel_id", referencedColumnName: "hotelId" }])
  faciHotel: Hotels;

  @OneToMany(() => FacilityPhoto, (facilityPhoto) => facilityPhoto.faphoFaci)
  facilityPhotos: FacilityPhoto[];

  @OneToMany(
    () => FacilityPriceHistory,
    (facilityPriceHistory) => facilityPriceHistory.faphFaci
  )
  facilityPriceHistories: FacilityPriceHistory[];

  @OneToMany(() => RestoMenus, (restoMenus) => restoMenus.remeFaci)
  restoMenus: RestoMenus[];

  @OneToMany(
    () => WorkOrderDetail,
    (workOrderDetail) => workOrderDetail.wodeFaci
  )
  workOrderDetails: WorkOrderDetail[];
}
