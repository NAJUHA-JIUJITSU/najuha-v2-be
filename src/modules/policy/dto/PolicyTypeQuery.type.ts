import { PolicyEntity } from '../../../infra/database/entities/policy.entity';

export type PolicyTypeQuery = { type?: PolicyEntity['type'] };
