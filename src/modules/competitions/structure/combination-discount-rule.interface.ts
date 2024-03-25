export type CombinationUnit = {
  uniform: 'GI' | 'NOGI';
  weight: 'WEIGHT' | 'ABSOLUTE';
};

export type CombinationDiscountRule = {
  combination: CombinationUnit[];
  discountAmount: number;
};
