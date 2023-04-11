import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CategoryGroup } from "./CategoryGroup";
import { Policy } from "./Policy";

@Index("poca_poli_id_pk", ["pocaId"], { unique: true })
@Entity("policy_category_group", { schema: "master" })
export class PolicyCategoryGroup {
  @PrimaryGeneratedColumn({ type: "integer", name: "poca_id" })
  pocaId: number;

  @ManyToOne(
    () => CategoryGroup,
    (categoryGroup) => categoryGroup.policyCategoryGroups,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "poca_cagro_id", referencedColumnName: "cagroId" }])
  pocaCagro: CategoryGroup;

  @ManyToOne(() => Policy, (policy) => policy.policyCategoryGroups, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "poca_poli_id", referencedColumnName: "poliId" }])
  pocaPoli: Policy;
}
