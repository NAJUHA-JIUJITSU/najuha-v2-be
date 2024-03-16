// import { IApplication } from './application.interface';
// import { CompetitionEntity } from './competition.interface';
// import { UserEntity } from './user.interface';

// export interface IApplicationPackage {
//   /**
//    * - application package id.
//    */
//   id: number;

//   /**
//    * - 주짓수 네트워크.
//    */
//   network: string;

//   /**
//    * - 소속 팀.
//    */
//   team: string;

//   /**
//    * - 관장님 성함.
//    */
//   masterName: string;

//   /**
//    * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
//    */
//   createdAt: Date | string;

//   /**
//    * - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간.
//    */
//   updatedAt: Date | string;

//   /**
//    * application id.
//    */
//   applicationId: number;

//   /**
//    * - application 정보
//    * - OneToMany: Application(1) -> ApplicationPackage(*)
//    */
//   applications?: IApplication[];

//   /**
//    * - competition id.
//    */
//   competitionId: number;

//   /**
//    * - competition 정보
//    * - ManyToOne: Competition(1) -> ApplicationPackage(*)
//    * - JoinColumn: competitionId
//    */
//   competition?: CompetitionEntity;

//   /**
//    * - payment
//    */

//   /**
//    * - 신청자 계정 id.
//    */
//   userId: number;

//   /**
//    * - 신청자 계정 정보
//    * - ManyToOne: User(1) -> Application(*)
//    * - JoinColumn: userId
//    */
//   user?: UserEntity;
// }
