import { Policy } from '../../domain/entities/policy.entity';

export interface IPolicy extends Omit<Policy, 'policyConsents'> {}
