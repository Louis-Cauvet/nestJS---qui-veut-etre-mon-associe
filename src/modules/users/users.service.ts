import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InterestsService } from '../interests/interests.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private interestsService: InterestsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { interests, password, ...userData } = createUserDto;

    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...userData,
      email: createUserDto.email,
      password: hashedPassword,
    });

    if (interests && interests.length > 0) {
      user.interests = await this.interestsService.findByIds(interests);
    }

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);

    if (!user) {
      return null;
    }

    const { interests, ...userData } = updateUserDto;
    Object.assign(user, userData);
    if (interests) {
      user.interests = await this.interestsService.findByIds(interests);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }

}