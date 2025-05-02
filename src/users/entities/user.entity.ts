import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ActivationCode } from '../../auth/entities/activation-code.entity';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ unique: true }) username!: string;

  @Column({ unique: true }) email!: string;

  @Column() password!: string;

  @Column({ default: false }) isActive!: boolean;

  @Column('simple-array') roles!: string[];

  @OneToMany(() => ActivationCode, ActivationCodes => ActivationCodes.user)
  activationCodes!: ActivationCode[];
}
