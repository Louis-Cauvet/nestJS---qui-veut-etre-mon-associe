import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {

  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user,
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }
}