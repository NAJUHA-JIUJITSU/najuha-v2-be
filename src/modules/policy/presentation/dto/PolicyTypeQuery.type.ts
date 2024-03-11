import { PolicyEntity } from '../../../../infrastructure/database/entities/policy.entity';

export type PolicyTypeQuery = { type?: PolicyEntity['type'] };
