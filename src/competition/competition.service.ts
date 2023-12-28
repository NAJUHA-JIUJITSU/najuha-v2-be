import { Injectable } from '@nestjs/common';
import { UserService } from '..//user/user.service';

@Injectable()
export class CompetitionService {
  constructor(private readonly userService: UserService) {}

  getMyCompetition(): string {
    return 'This action returns all competitions';
    //return this.userService.getUser();
  }
}
