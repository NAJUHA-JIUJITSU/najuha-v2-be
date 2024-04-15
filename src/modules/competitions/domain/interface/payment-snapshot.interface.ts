import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

export interface IPaymentSnapshot {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /** - entity 생성 시간. */
  createdAt: Date | string;

  /**
   * - pacage total amount.
   * @type uint32
   * @minimum 0
   */
  normalAmount: number;

  /**
   * - earlybird discount amount.
   * @type uint32
   * @minimum 0
   */
  earlybirdDiscountAmount: number;

  /**
   * - combination discount amount.
   * @type uint32
   * @minimum 0
   */
  combinationDiscountAmount: number;

  /**
   * - total amount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount.
   * @type uint32
   * @minimum 0
   */
  totalAmount: number;

  /** - application id. */
  applicationId: IApplication['id'];
}
