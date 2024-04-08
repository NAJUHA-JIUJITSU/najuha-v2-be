import { IDivision } from './division.interface';

export interface ICombinationUnit {
  uniformType: IDivision['uniform'];
  weightType: 'WEIGHT' | 'ABSOLUTE';
}

export interface ICombinationDiscountRule {
  combination: ICombinationUnit[];
  discountAmount: number;
}
