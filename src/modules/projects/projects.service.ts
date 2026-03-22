import {Injectable,NotFoundException,ForbiddenException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InterestsService } from '../interests/interests.service';
import { User, UserRole } from '../users/entities/user.entity';

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

    if (interests?.length) {
      project.interests = await this.interestsService.findByIds(interests);
    }

    return this.projectRepository.save(project);
  }

  async findAll() {
    return this.projectRepository.find({
      relations: ['entrepreneur', 'interests'],
    });
  }

  async findOneOrFail(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['entrepreneur', 'interests'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: User) {
    const project = await this.findOneOrFail(id);

    if (project.entrepreneur.id !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    const { interests, ...projectData } = updateProjectDto;
    Object.assign(project, projectData);

    if (interests) {
      project.interests = await this.interestsService.findByIds(interests);
    }

    return this.projectRepository.save(project);
  }

  async remove(id: string, user: User) {
    const project = await this.findOneOrFail(id);

    const isOwner = project.entrepreneur.id === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this project');
    }

    await this.projectRepository.remove(project);

    return { message: 'Project deleted successfully' };
  }

  async findRecommended(user: User) {
    if (!user.interests?.length) {
      return [];
    }

    const interestIds = user.interests.map((interest) => interest.id);

    return this.projectRepository.find({
      where: {
        interests: {
          id: In(interestIds),
        },
      },
      relations: ['entrepreneur', 'interests'],
    });
  }
}