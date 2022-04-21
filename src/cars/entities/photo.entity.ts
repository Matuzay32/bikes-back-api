import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cars } from './cars.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '' })
  url: string;

  @ManyToOne(() => Cars, (cars) => cars.photos, {
    onDelete: 'CASCADE',
    // onUpdate: 'CASCADE',
    // cascade: true,
  })
  @JoinColumn({ name: 'car_id' })
  cars: Cars;
}
