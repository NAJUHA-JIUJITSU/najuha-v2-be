import { IUser } from '../../user.interface';

export interface UserResDto extends Omit<IUser, 'policyConsents'> {}
