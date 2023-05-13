import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { Entitys } from './Entitys';

@Index('payment_gateway_paga_code_key', ['pagaCode'], { unique: true })
@Index('paga_entity_id_pk', ['pagaEntityId'], { unique: true })
@Index('payment_gateway_paga_name_key', ['pagaName'], { unique: true })
@Entity('payment_gateway', { schema: 'payment' })
export class PaymentGateway {
  @Column('integer', { primary: true, name: 'paga_entity_id' })
  pagaEntityId: number;

  @Column('character varying', {
    name: 'paga_code',
    nullable: true,
    unique: true,
    length: 10,
  })
  pagaCode: string | null;

  @Column('character varying', {
    name: 'paga_name',
    nullable: true,
    unique: true,
    length: 55,
  })
  pagaName: string | null;

  @Column('timestamp without time zone', {
    name: 'paga_modified_date',
    nullable: true,
  })
  pagaModifiedDate: Date | null;

  @OneToOne(() => Entitys, (entitys) => entitys.paymentGateway, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'paga_entity_id', referencedColumnName: 'entityId' }])
  pagaEntity: Entitys;
}
