import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InvestmentsService } from '../investments/investments.service';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService, private investmentsService: InvestmentsService) {}

  findAllUsers() {
    return this.usersService.findAll();
  }

  deleteUser(id: string) {
    return this.usersService.remove(id);
  }

  findAllInvestments() {
    return this.investmentsService.findAllForAdmin();
  }
}