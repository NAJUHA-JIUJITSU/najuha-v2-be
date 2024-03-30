import { PaymentSnapshot } from 'src/infrastructure/database/entities/competition/payment-snapshot.entity';

export interface IExpectedPayment {
  normalAmount: PaymentSnapshot['normalAmount'];
  earlybirdDiscountAmount: PaymentSnapshot['earlybirdDiscountAmount'];
  combinationDiscountAmount: PaymentSnapshot['combinationDiscountAmount'];
  totalAmount: PaymentSnapshot['totalAmount'];
}
