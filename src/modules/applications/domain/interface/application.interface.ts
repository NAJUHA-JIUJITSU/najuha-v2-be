import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPlayerSnapshot } from './player-snapshot.interface';
import { IParticipationDivision } from './participation-division.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

export interface IApplication {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

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

  /** - player snapshots. */
  playerSnapshots: IPlayerSnapshot[];

  /** - payment snapshots. */
  participationDivisions: IParticipationDivision[];

  /** - competition id. */
  competitionId: ICompetition['id'];

  /** - user id. */
  userId: IUser['id'];
}

export namespace IApplication {
  // Validate Application Ability Context. -----------------------------------------------------
  export namespace ValidateApplicationAbility {
    export interface Player
      extends Pick<
        IPlayerSnapshot,
        'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
      > {}

    export interface Competition extends ICompetition {
      divisions: IDivision[];
    }
  }

  //Create Application Context. ----------------------------------------------------------------
  export namespace Create {
    export interface User extends IUser {}

    export interface Player
      extends Pick<
        IPlayerSnapshot,
        'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
      > {}

    export interface PlayerSnapshot extends IPlayerSnapshot {}

    export interface Competition extends ICompetition {
      divisions: IDivision[];
    }

    export interface Application extends IApplication {}
  }

  // Get Application Context. ------------------------------------------------------------------
  export namespace Get {
    export interface Application extends IApplication {}
  }

  // Update Ready Application Context. --------------------------------------------------------
  export namespace UpdateReadyApplication {
    export interface Application extends IApplication {}

    export interface Player
      extends Pick<
        IPlayerSnapshot,
        'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
      > {}

    export interface Competition extends ICompetition {
      divisions: IDivision[];
    }
  }

  // Calculate Payment Context. ----------------------------------------------------------------
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
}
