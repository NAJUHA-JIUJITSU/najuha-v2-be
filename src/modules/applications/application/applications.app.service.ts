import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreateApplicationReqDto } from '../structure/dto/request/create-application.req.dto';
import { ApplicationRepository } from '../application.repository';
import { Application } from '../domain/entities/application.entity';
import { ApplicationFactory } from '../domain/application.factory';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
  ) {}

  // TODO: Transaction
  async createApplication(userId: User['id'], dto: CreateApplicationReqDto): Promise<Application> {
    const application = await this.applicationFactory.create(userId, dto);
    // const expectedPayment = application.calculatePaymentSnapshot();
    // TODO: expectedPayment 어떻게 반환할지 고민
    console.log('application', application);
    return application;
  }
}
