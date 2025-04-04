import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { User } from '../../../users/user.entity';
import { Trip } from '../../entities/trip.entity';
import { Exclude } from 'class-transformer';

export enum TripRole {
  MEMBER = 'Member',
  ADMIN = 'Admin',
}

@Entity('trip_members')
@Unique(['trip', 'user']) // Ensures unique (trip_id, user_id) combination
export class Member {
  @Exclude()
  @PrimaryColumn({ type: 'uuid' }) // Mark trip_id as part of the primary key
  trip_id: string;

  @Exclude()
  @PrimaryColumn({ type: 'uuid' }) // Mark user_id as part of the primary key
  user_id: string;

  @ManyToOne(() => Trip, (trip) => trip.id, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  role: TripRole;

  @CreateDateColumn()
  joined_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
