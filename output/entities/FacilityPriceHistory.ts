import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Facilities } from "./Facilities";

@Index("pk_facility_price_history", ["faphId"], { unique: true })
@Entity("facility_price_history", { schema: "hotel" })
export class FacilityPriceHistory {
  @PrimaryGeneratedColumn({ type: "integer", name: "faph_id" })
  faphId: number;

  @Column("timestamp without time zone", {
    name: "faph_startdate",
    nullable: true,
  })
  faphStartdate: Date | null;

  @Column("timestamp without time zone", {
    name: "faph_enddate",
    nullable: true,
  })
  faphEnddate: Date | null;

  @Column("money", { name: "faph_low_price", nullable: true })
  faphLowPrice: string | null;

  @Column("money", { name: "faph_high_price", nullable: true })
  faphHighPrice: string | null;

  @Column("money", { name: "faph_rate_price", nullable: true })
  faphRatePrice: string | null;

  @Column("money", { name: "faph_discount", nullable: true })
  faphDiscount: string | null;

  @Column("money", { name: "faph_tax_rate", nullable: true })
  faphTaxRate: string | null;

  @Column("timestamp without time zone", {
    name: "faph_modified_date",
    nullable: true,
  })
  faphModifiedDate: Date | null;

  @Column("integer", { name: "faph_user_id", nullable: true })
  faphUserId: number | null;

  @ManyToOne(
    () => Facilities,
    (facilities) => facilities.facilityPriceHistories,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "faph_faci_id", referencedColumnName: "faciId" }])
  faphFaci: Facilities;
}
