import { IUser } from '../../users/domain/interface/user.interface';

export interface ISnsAuthStrategy {
  validate(snsAuthCode: string): Promise<IUser.Dto.Create>;
}
