import { Controller, Get, Post, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('investor')
  @Post()
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @CurrentUser() user,
  ) {
    return this.investmentsService.create(createInvestmentDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('investor')
  @Get()
  findMyInvestments(@CurrentUser() user) {
    return this.investmentsService.findMyInvestments(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:id')
  findByProject(@Param('id') projectId: string, @CurrentUser() user) {
    return this.investmentsService.findByProject(projectId, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('investor')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.investmentsService.remove(id, user);
  }
}
