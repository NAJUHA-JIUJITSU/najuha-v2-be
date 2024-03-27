import { PolicyConsent } from '../../domain/entities/policy-consent.entity';

export interface IPolicyConsent extends Omit<PolicyConsent, 'user' | 'policy'> {}
