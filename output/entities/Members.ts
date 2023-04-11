import { Column, Entity, Index } from "typeorm";

@Index("memb_name_pk", ["membName"], { unique: true })
@Entity("members", { schema: "master" })
export class Members {
  @Column("character varying", { primary: true, name: "memb_name", length: 15 })
  membName: string;

  @Column("character varying", {
    name: "memb_description",
    nullable: true,
    length: 100,
  })
  membDescription: string | null;
}
