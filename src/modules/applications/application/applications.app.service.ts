import { Injectable } from '@nestjs/common';
import { CreateApplicationReqDto } from '../dto/request/create-application.req.dto';
import { ApplicationRepository } from '../application.repository';
import { ApplicationFactory } from '../domain/application.factory';
import { IExpectedPayment } from '../domain/structure/expected-payment.interface';
import { IUser } from 'src/modules/users/domain/structure/user.interface';
import { IApplication } from '../domain/structure/application.interface';
import { ApplicationDomainService } from '../domain/application.domain.service';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
    private readonly applicationDomainService: ApplicationDomainService,
  ) {}

  async createApplication(userId: IUser['id'], dto: CreateApplicationReqDto): Promise<IApplication> {
    const user = await this.applicationRepository.getUser(userId);
    const competition = await this.applicationRepository.getCompetition(dto.competitionId);

    // competition.validateExistDivisions(dto.divisionIds);

    // TODO: check gender
    // competition.validateGender(user)
    // TODO: check age
    // competition.validateAge(user);

    let application = await this.applicationFactory.create(dto, user, competition);
    application = await this.applicationRepository.saveApplication(application);
    return application;
  }

  async getExpectedPayment(applicationId: IApplication['id']): Promise<IExpectedPayment> {
    const application = await this.applicationRepository.getApplication(applicationId);
    return this.applicationDomainService.calculateExpectedPrice(application);
  }
}
