import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Boats } from './boats.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '' })
  url: string;

  @ManyToOne(() => Boats, (boats) => boats.photos, {
    onDelete: 'CASCADE',
    // onUpdate: 'CASCADE',
    // cascade: true,
  })
  @JoinColumn({ name: 'boats_id' })
  boats: Boats;
}
