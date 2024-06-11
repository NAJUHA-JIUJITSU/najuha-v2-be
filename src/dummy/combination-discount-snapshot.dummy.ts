import { ICombinationDiscountRule } from '../modules/competitions/domain/interface/combination-discount-rule.interface';

export const dummyCombinationDiscountRules: ICombinationDiscountRule[] = [
  // 2-item combinations
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 10000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
    ],
    discountAmount: 10000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 10000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
    ],
    discountAmount: 10000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 10000,
  },
  {
    combination: [
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 10000,
  },

  // 3-item combinations
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
    ],
    discountAmount: 20000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 20000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 20000,
  },
  {
    combination: [
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 20000,
  },

  // 4-item combination
  {
    combination: [
      { uniformType: 'GI', weightType: 'WEIGHT' },
      { uniformType: 'GI', weightType: 'ABSOLUTE' },
      { uniformType: 'NOGI', weightType: 'WEIGHT' },
      { uniformType: 'NOGI', weightType: 'ABSOLUTE' },
    ],
    discountAmount: 30000,
  },
];
