import { Controller, Get } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  getHello(): string {
    return this.competitionService.getMyCompetition();
  }
}
