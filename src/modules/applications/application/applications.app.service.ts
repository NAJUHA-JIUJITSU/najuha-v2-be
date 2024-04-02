import { Injectable } from '@nestjs/common';
import { CreateApplicationReqDto } from '../dto/request/create-application.req.dto';
import { ApplicationRepository } from '../application.repository';
import { ApplicationFactory } from '../domain/application.factory';
import { IExpectedPayment } from '../domain/structure/expected-payment.interface';
import { IUser } from 'src/modules/users/domain/structure/user.interface';
import { IApplication } from '../domain/structure/application.interface';
import { ApplicationDomainService } from '../domain/application.domain.service';
import { ApplicationValidator } from '../domain/application.validator';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
    private readonly applicationDomainService: ApplicationDomainService,
    private readonly applicationValidator: ApplicationValidator,
  ) {}

  async createApplication(userId: IUser['id'], dto: CreateApplicationReqDto): Promise<IApplication> {
    const user = await this.applicationRepository.getUser(userId);
    const competition = await this.applicationRepository.getCompetition(dto.competitionId, 'ACTIVE');

    await this.applicationValidator.validateApplication(dto, competition);

    const application = this.applicationFactory.create(dto, user, competition);
    return await this.applicationRepository.saveApplication(application);
  }

  async getExpectedPayment(userId: IUser['id'], applicationId: IApplication['id']): Promise<IExpectedPayment> {
    const application = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: ['participationDivisions', 'participationDivisions.participationDivisionSnapshots'],
    });
    return this.applicationDomainService.calculateExpectedPrice(application);
  }

  async getApplication(userId: IUser['id'], applicationId: IApplication['id']): Promise<IApplication> {
    const application = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: [
        'playerSnapshots',
        'participationDivisions',
        'participationDivisions.participationDivisionSnapshots',
        'participationDivisions.participationDivisionSnapshots.division',
      ],
    });
    return application;
  }
}
