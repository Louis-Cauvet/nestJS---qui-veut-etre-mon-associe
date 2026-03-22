import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InterestsService } from '../interests/interests.service';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';



@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private interestsService: InterestsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { interests, password, role, ...userData } = createUserDto;

    if (role === UserRole.ADMIN) {
      throw new BadRequestException('Admin role cannot be assigned during public registration');
    }

    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...userData,
      email: createUserDto.email,
      password: hashedPassword,
      role: role ?? UserRole.ENTREPRENEUR,
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

  async getUserInterests(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.interests ?? [];
  }

  async updateUserInterests(id: string, interestIds: string[]) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.interests = await this.interestsService.findByIds(interestIds);

    return this.usersRepository.save(user);
  }
}