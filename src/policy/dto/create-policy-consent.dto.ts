import { PolicyConsentEntity } from '../entities/policy-consent.entity';

export type CreatePolicyConsentDto = Pick<PolicyConsentEntity, 'userId' | 'policyId' | 'consentedAt'>;
