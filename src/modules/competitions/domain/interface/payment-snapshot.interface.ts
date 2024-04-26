import { IApplication } from 'src/modules/applications/domain/interface/application.interface';
import { tags } from 'typia';

export interface IPaymentSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** CreatedAt */
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** 할인이 적용되지 않은 총 금액 (원). */
  normalAmount: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** Earlybird discount amount. (원). */
  earlybirdDiscountAmount: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** Combination discount amount. (원). */
  combinationDiscountAmount: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /**
   * Total amount 할인이 적용된 최종금액. (원).
   * - 계산 방법 : normalAmount - earlybirdDiscountAmount - combinationDiscountAmount.
   */
  totalAmount: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** - application id. */
  applicationId: IApplication['id'];
}
