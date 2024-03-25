export interface ICombinationUnit {
  uniform: 'GI' | 'NOGI';
  weight: 'WEIGHT' | 'ABSOLUTE';
}

export interface ICombinationDiscountRule {
  combination: ICombinationUnit[];
  discountAmount: number;
}
