import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from '../../entities/trip.entity';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../../users/user.entity';

@Entity('shopping_items')
export class ShoppingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip, (trip) => trip.id, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  @Exclude()
  trip: Trip;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'suggested_by' })
  suggestedBy: User;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  quantity: string;

  @Column()
  @IsNotEmpty()
  @IsBoolean()
  bought: boolean;

  @CreateDateColumn()
  created_at: Date;
}
