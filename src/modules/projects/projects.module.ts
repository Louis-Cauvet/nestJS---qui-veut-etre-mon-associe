import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersModule } from '../users/users.module';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
    InterestsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}