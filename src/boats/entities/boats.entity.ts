import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Photo } from './photo.entity';
@Entity()
export class Boats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  model: string;

  @Column({ default: '' })
  version: string;

  @Column({ default: 1 })
  price: number;

  @Column({ default: 1 })
  previousPrice: number;

  @Column({ default: '' })
  frase: string;

  @OneToMany(() => Photo, (photo) => photo.boats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  photos: Photo[];
}
