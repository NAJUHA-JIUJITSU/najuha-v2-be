import { tags } from 'typia';
import { IDivision } from './division.interface';
import { IPriceSnapshot } from './price-snapshot.interface';

export interface IDivisionPack {
  /**
   * 생성하고자 하는 카테고리 이름.
   * - ex) '초등부', '중등부', '고등부', '어덜트', '마스터'.
   */
  categories: IDivision['category'][] & tags.MinItems<1>;
  /**
   * 생성하고자 하는 유니폼 종류.
   * - ex) 'GI', 'NOGI'.
   */
  uniforms: IDivision['uniform'][] & tags.MinItems<1>;
  /**
   * 생성하고자 하는 성별.
   * - ex) 'MALE', 'FEMALE', 'MIXED'.
   */
  genders: IDivision['gender'][] & tags.MinItems<1>;
  /**
   * 생성하고자 하는 주짓수 벨트.
   * - ex) '화이트', '블루', '퍼플', '브라운', '블랙'.
   */
  belts: IDivision['belt'][] & tags.MinItems<1>;

  /**
   * 생성하고자 하는 체급.
   * - ex) '-40', '-45', '-50', '+50', 'ABSOLUTE'.
   */
  weights: IDivision['weight'][] & tags.MinItems<1>;

  /** 생성하고자 하는 출생년도 범위 시작. */
  birthYearRangeStart: IDivision['birthYearRangeStart'];

  /** 생성하고자 하는 출생년도 범위 끝. */
  birthYearRangeEnd: IDivision['birthYearRangeEnd'];

  /** 생성하고자 하는 가격. */
  price: IPriceSnapshot['price'];
}
