import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user.entity';
import { TripMember } from '../../trip-member/entities/trip-members.entity';

export enum TripStatus {
  PLANNING = 'Planning',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PLANNING })
  status: TripStatus;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'trip_owner' })
  trip_owner: User;

  @Column()
  title: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => TripMember, (tripMember) => tripMember.trip, {
    nullable: false,
  })
  tripMembers: [TripMember];
}
