import { IDivision } from './division.interface';

export interface ICombinationUnit {
  uniform: IDivision['uniform'];
  weight: 'WEIGHT' | 'ABSOLUTE';
}

export interface ICombinationDiscountRule {
  combination: ICombinationUnit[];
  discountAmount: number;
}
