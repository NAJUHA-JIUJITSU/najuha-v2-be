import { ITemporaryUserCreateDto } from '../../users/domain/interface/temporary-user.interface';

export interface ISnsAuthStrategy {
  validate(snsAuthCode: string): Promise<ITemporaryUserCreateDto>;
}
