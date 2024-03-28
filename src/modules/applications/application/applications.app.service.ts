import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreateApplicationReqDto } from '../structure/dto/request/create-application.req.dto';
import { ApplicationRepository } from '../application.repository';
import { Application } from '../domain/entities/application.entity';
import { ApplicationFactory } from '../domain/application.factory';
import { IExpectedPayment } from '../structure/interface/expectedPayment.interface';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
  ) {}

  // TODO: Transaction
  async createApplication(userId: User['id'], dto: CreateApplicationReqDto): Promise<Application> {
    return await this.applicationFactory.create(userId, dto);
  }

  async getExpectedPayment(applicationId: Application['id']): Promise<IExpectedPayment> {
    const application = await this.applicationRepository.getApplication(applicationId);
    const competition = await this.applicationRepository.getCompetition(application.competitionId);
    return competition.calculateExpectedPayment(application);
  }
}
