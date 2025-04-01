import { Exclude } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @IsNotEmpty()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @IsUrl()
  @Column()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', select: false })
  password: string;

  @IsDate()
  @CreateDateColumn()
  created_at: Date;

  @IsDate()
  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
