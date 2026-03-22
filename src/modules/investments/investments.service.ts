import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { ProjectsService } from '../projects/projects.service';
import { User, UserRole } from '../users/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class InvestmentsService {

  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
    private projectsService: ProjectsService,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, user: User) {
    const project = await this.projectsService.findOneOrFail(createInvestmentDto.projectId);

    if (project.entrepreneur.id === user.id) {
      throw new ForbiddenException(
        'You cannot invest in your own project',
      );
    }

    const existingInvestment = await this.investmentRepository.findOne({
      where: {
        investor: { id: user.id },
        project: { id: project.id },
      },
    });

    if (existingInvestment) {
      throw new BadRequestException(
        'You have already invested in this project',
      );
    }

    const investment = this.investmentRepository.create({
      amount: createInvestmentDto.amount,
      project,
      investor: user,
    });

    return this.investmentRepository.save(investment);
  }

  async findMyInvestments(userId: string) {
    return this.investmentRepository.find({
      where: {
        investor: { id: userId },
      },
      relations: ['investor', 'project'],
    });
  }

  async findByProject(projectId: string, user: User) {
    const project = await this.projectsService.findOneOrFail(projectId);

    const isOwner = project.entrepreneur.id === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot view investments for this project');
    }

    return this.investmentRepository.find({
      where: {
        project: { id: projectId },
      },
      relations: ['investor', 'project'],
    });
  }

  async remove(id: string, user: User) {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['investor', 'project'],
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.investor.id !== user.id) {
      throw new ForbiddenException('You can only cancel your own investment');
    }

    await this.investmentRepository.remove(investment);

    return { message: 'Investment cancelled successfully' };
  }

  findAllForAdmin() {
    return this.investmentRepository.find({
      relations: ['investor', 'project'],
    });
  }
}