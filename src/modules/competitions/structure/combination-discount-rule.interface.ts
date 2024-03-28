import { Division } from '../domain/entities/division.entity';

export interface ICombinationUnit {
  uniform: Division['uniform'];
  weight: 'WEIGHT' | 'ABSOLUTE';
}

export interface ICombinationDiscountRule {
  combination: ICombinationUnit[];
  discountAmount: number;
}
