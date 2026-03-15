import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @CurrentUser() user,
  ) {
    return this.investmentsService.create(createInvestmentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.investmentsService.findAll();
  }
}