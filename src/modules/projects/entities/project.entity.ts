import {Entity,Column,PrimaryGeneratedColumn,CreateDateColumn,ManyToOne,ManyToMany,JoinTable,} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Interest } from '../../interests/entities/interest.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  entrepreneur: User;

  @ManyToMany(() => Interest)
  @JoinTable()
  interests: Interest[];
}