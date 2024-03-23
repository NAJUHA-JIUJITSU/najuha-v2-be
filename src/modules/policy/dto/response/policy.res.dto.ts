import { OmitOptional } from 'src/common/omit-optional.type';
import { PolicyEntity } from 'src/infrastructure/database/entities/policy/policy.entity';

export type PolicyResDto = OmitOptional<PolicyEntity>;
