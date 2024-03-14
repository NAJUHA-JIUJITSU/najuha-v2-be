import { IUser } from 'src/interfaces/user.interface';

export interface UserResDto extends Omit<IUser, 'policyConsents'> {}
