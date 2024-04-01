import { Division } from '../../../../infrastructure/database/entities/competition/division.entity';

export interface ICombinationUnit {
  uniform: Division['uniform'];
  weight: 'WEIGHT' | 'ABSOLUTE';
}

export interface ICombinationDiscountRule {
  combination: ICombinationUnit[];
  discountAmount: number;
}
