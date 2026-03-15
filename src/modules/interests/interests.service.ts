import { Injectable } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Interest } from './entities/interest.entity';

@Injectable()
export class InterestsService {

  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const interest = this.interestsRepository.create(createInterestDto);

    return this.interestsRepository.save(interest);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  async findOne(id: string): Promise<Interest | null> {
    return this.interestsRepository.findOneBy({ id });
  }

  async findByIds(ids: string[]): Promise<Interest[]> {
    return this.interestsRepository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateInterestDto: UpdateInterestDto): Promise<Interest | null> {
    const interest = await this.findOne(id);
    if (!interest) return null;

    Object.assign(interest, updateInterestDto);

    return this.interestsRepository.save(interest);
  }

  async remove(id: string) {
    return this.interestsRepository.delete(id);
  }
}