import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToOne,} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Investment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  investor: User;

  @ManyToOne(() => Project)
  project: Project;
}