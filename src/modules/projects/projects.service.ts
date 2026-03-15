import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { InterestsService } from '../interests/interests.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private interestsService: InterestsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const { interests, ...projectData } = createProjectDto;

    const project = this.projectRepository.create({
      ...projectData,
      entrepreneur: user,
    });

    if (interests && interests.length > 0) {
      project.interests = await this.interestsService.findByIds(interests);
    }

    return this.projectRepository.save(project);
  }

  findAll() {
    return this.projectRepository.find({
      relations: ['entrepreneur', 'interests'],
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['entrepreneur', 'interests'],
    });
  }
}