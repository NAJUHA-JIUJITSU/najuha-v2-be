import { User } from '../../domain/entities/user.entity';

export interface IUser extends Omit<User, 'policyConsents' | 'applications'> {}
