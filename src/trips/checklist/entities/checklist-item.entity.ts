import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from '../../entities/trip.entity';
import { User } from '../../../users/user.entity';
import { Exclude } from 'class-transformer';

@Entity('check_list')
export class ChecklistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip, (trip) => trip.id, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  @Exclude()
  trip: Trip;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'assignee' })
  assignee: User;

  @Column()
  @IsBoolean()
  done: boolean;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;
}
