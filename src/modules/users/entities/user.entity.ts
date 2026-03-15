import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ManyToMany, JoinTable } from 'typeorm';
import { Interest } from '../../interests/entities/interest.entity';

export enum UserRole {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  ADMIN = 'admin',
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ENTREPRENEUR,
  })
  role: UserRole;

  @ManyToMany(() => Interest, (interest) => interest.users, {
    eager: true,
  })
  @JoinTable()
  interests: Interest[];

  @CreateDateColumn()
  createdAt: Date;
}