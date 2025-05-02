import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('codigo_activacion')
export class ActivationCode {
  @PrimaryGeneratedColumn() id!: number;
  @Column() code!: string;
  @Column('datetime') dateCreated!: Date;
  @Column('datetime') expiration!: Date;
  @Column('datetime', { nullable: true }) dateUsed!: Date | null;
  @Column({ default: false }) used!: boolean;
  @ManyToOne(() => User, user => user.activationCodes) user!: User;
}
