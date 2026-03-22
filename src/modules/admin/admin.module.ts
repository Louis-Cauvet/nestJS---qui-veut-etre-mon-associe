import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { InvestmentsModule } from '../investments/investments.module';

@Module({
  imports: [UsersModule, InvestmentsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
