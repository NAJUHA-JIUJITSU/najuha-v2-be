import { Injectable } from '@nestjs/common';
import { CreateApplicationReqDto } from '../structure/dto/request/create-application.req.dto';
import { ApplicationRepository } from '../application.repository';
import { Application } from '../../../infrastructure/database/entities/application/application.entity';
import { ApplicationFactory } from '../domain/application.factory';
import { IExpectedPayment } from '../domain/expected-payment.interface';
import { IUser } from 'src/modules/users/domain/user.interface';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
  ) {}

  async createApplication(userId: IUser['id'], dto: CreateApplicationReqDto): Promise<Application> {
    const user = await this.applicationRepository.getUser(userId);
    const competition = await this.applicationRepository.getCompetition(dto.competitionId);

    competition.validateExistDivisions(dto.divisionIds);

    // TODO: check gender
    // competition.validateGender(user)
    // TODO: check age
    // competition.validateAge(user);

    let application = await this.applicationFactory.create(dto, user, competition);
    application = await this.applicationRepository.saveApplication(application);
    return application;
  }

  async getExpectedPayment(applicationId: Application['id']): Promise<IExpectedPayment> {
    const application = await this.applicationRepository.getApplication(applicationId);
    const participationDivisionIds = application.participationDivisions.map((participationDivision) => {
      return participationDivision.participationDivisionSnapshots[
        participationDivision.participationDivisionSnapshots.length - 1
      ].divisionId;
    });
    const competition = await this.applicationRepository.getCompetition(application.competitionId);
    return competition.calculateExpectedPayment(participationDivisionIds);
  }
}
