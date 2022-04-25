import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farms } from './farms.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '' })
  url: string;

  @ManyToOne(() => Farms, (farms) => farms.photos, {
    onDelete: 'CASCADE',
    // onUpdate: 'CASCADE',
    // cascade: true,
  })
  @JoinColumn({ name: 'farm_id' })
  farms: Farms;
}
