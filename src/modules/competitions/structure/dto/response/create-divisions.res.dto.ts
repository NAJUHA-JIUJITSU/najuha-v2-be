import { OmitOptional } from 'src/common/omit-optional.type';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';

export interface CreateDivisionsResDto {
  divisions: OmitOptional<Division>[];
}
