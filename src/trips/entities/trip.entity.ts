import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TripMember } from './trip-members.entity';
import { User } from '../../users/user.entity';

export enum TripStatus {
  PLANNING = 'Planning',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PLANNING })
  status: TripStatus;

  // @ManyToOne((_type) => User)
  // @JoinColumn()
  // user: User;

  @Column()
  trip_owner: string;

  @Column()
  title: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  //   @OneToMany(() => TripMember, (tripMember) => tripMember.trip)
  //   tripMembers: TripMember[];
}
