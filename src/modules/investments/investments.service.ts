import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InvestmentsService {

  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
    private projectsService: ProjectsService,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, user: User) {
    const project = await this.projectsService.findOne(createInvestmentDto.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const investment = this.investmentRepository.create({
      amount: createInvestmentDto.amount,
      project: project,
      investor: user,
    });

    return this.investmentRepository.save(investment);
  }

  findAll() {
    return this.investmentRepository.find({
      relations: ['investor', 'project'],
    });
  }
}