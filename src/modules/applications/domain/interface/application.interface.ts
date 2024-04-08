import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPlayerSnapshot } from './player-snapshot.interface';
import { IParticipationDivision } from './participation-division.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

export interface IApplication {
  /**
   * - application id.
   * @type uint32
   */
  id: number;

  /**  - created at. */
  createdAt: Date | string;

  /** - updated at. */
  updatedAt: Date | string;

  /**
   * - status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  status: 'READY' | 'DONE' | 'CANCELED';

  earlybirdDiscountSnapshotId: IEarlybirdDiscountSnapshot['id'];

  /** - combination discount snapshot id. */
  combinationDiscountSnapshotId: ICombinationDiscountSnapshot['id'];

  /** - competition id. */
  competitionId: ICompetition['id'];

  /** - user id. */
  userId: IUser['id'];
}

export namespace IApplication {
  export namespace Create {
    export interface User extends IUser {}

    export interface Player
      extends Pick<
        IPlayerSnapshot,
        'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
      > {}

    export interface Competition extends ICompetition {
      divisions: IDivision[];
    }

    export interface Application extends IApplication {
      playerSnapshots: IPlayerSnapshot[];
      participationDivisions: Omit<IParticipationDivision, 'priceSnapshotId'>[];
    }
  }

  export namespace Get {
    export type Application = ReadyApplication | DoneApplication | CanceledApplication;

    export interface BaseApplication extends Omit<IApplication, 'status'> {
      playerSnapshots: IPlayerSnapshot[];
      participationDivisions: IParticipationDivision[];
    }

    export interface ReadyApplication extends BaseApplication {
      status: 'READY';
      // 'READY' 상태일 때만 필요한 프로퍼티 추가
    }

    export interface DoneApplication extends BaseApplication {
      status: 'DONE';
      // 'DONE' 상태일 때만 필요한 프로퍼티 추가
    }

    export interface CanceledApplication extends BaseApplication {
      status: 'CANCELED';
      // 'CANCELED' 상태일 때만 필요한 프로퍼티 추가
    }
  }

  export namespace CalculatePayment {
    export interface Application extends IApplication {
      participationDivisions: IParticipationDivision[];
    }

    export interface Competition extends ICompetition {
      divisions: IDivision[];
      earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];
      combinationDiscountSnapshots: ICombinationDiscountSnapshot[];
    }
  }

  export namespace Update {
    export interface Application extends IApplication {
      playerSnapshots: IPlayerSnapshot[];
      participationDivisions: IParticipationDivision[];
    }

    export interface Competition extends ICompetition {
      divisions: IDivision[];
      earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];
      combinationDiscountSnapshots: ICombinationDiscountSnapshot[];
    }
  }
}
