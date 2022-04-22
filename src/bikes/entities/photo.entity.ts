import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bikes } from './bikes.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '' })
  url: string;

  @ManyToOne(() => Bikes, (bikes) => bikes.photos, {
    onDelete: 'CASCADE',
    // onUpdate: 'CASCADE',
    // cascade: true,
  })
  @JoinColumn({ name: 'bike_id' })
  bikes: Bikes;
}
