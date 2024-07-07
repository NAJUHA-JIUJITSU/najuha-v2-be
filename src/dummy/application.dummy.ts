import { IAdditionalInfoCreateDto } from '../modules/applications/domain/interface/additional-info.interface';
import { IApplication } from '../modules/applications/domain/interface/application.interface';
import {
  IPlayerSnapshot,
  IPlayerSnapshotCreateDto,
} from '../modules/applications/domain/interface/player-snapshot.interface';
import { ICompetition } from '../modules/competitions/domain/interface/competition.interface';
import { IDivision } from '../modules/competitions/domain/interface/division.interface';
import { CompetitionModel } from '../modules/competitions/domain/model/competition.model';
import { IUser } from '../modules/users/domain/interface/user.interface';
import { uuidv7 } from 'uuidv7';

type IDummyParticipationDivisionUnit = [
  category: IDivision['category'],
  uniform: IDivision['uniform'],
  gender: IDivision['gender'],
  belt: IDivision['belt'],
  weight: IDivision['weight'],
];

export type IParticipationDivisionCombination = IDummyParticipationDivisionUnit[];

const APPLICATION_DUMMY_CASE: {
  playerGender: IPlayerSnapshot['gender'];
  playerBelt: IPlayerSnapshot['belt'];
  participationDivisionCombination: IParticipationDivisionCombination;
}[] = [
  // 초등부12 MALE
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['초등부12', 'GI', 'MIXED', '화이트', '-20']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['초등부12', 'GI', 'MIXED', '화이트', '-20'],
      ['초등부12', 'GI', 'MIXED', '유색', '-20'],
    ],
  },
  // 초등부12 FEMALE
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['초등부12', 'GI', 'MIXED', '화이트', '-20']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['초등부12', 'GI', 'MIXED', '화이트', '-20'],
      ['초등부12', 'GI', 'MIXED', '유색', '-20'],
    ],
  },
  // 초등부34 MALE
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['초등부34', 'GI', 'MALE', '화이트', '-25']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['초등부34', 'GI', 'MALE', '화이트', '-25'],
      ['초등부34', 'GI', 'MALE', '유색', '-25'],
    ],
  },
  // 초등부34 FEMALE
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['초등부34', 'GI', 'FEMALE', '화이트', '-25']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['초등부34', 'GI', 'FEMALE', '화이트', '-25'],
      ['초등부34', 'GI', 'FEMALE', '유색', '-25'],
    ],
  },
  // 초등부56 MALE
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['초등부56', 'GI', 'MALE', '화이트', '-25']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['초등부56', 'GI', 'MALE', '화이트', '-25'],
      ['초등부56', 'GI', 'MALE', '유색', '-25'],
    ],
  },
  // 초등부56 FEMALE
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['초등부56', 'GI', 'FEMALE', '화이트', '-25']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['초등부56', 'GI', 'FEMALE', '화이트', '-25'],
      ['초등부56', 'GI', 'FEMALE', '유색', '-25'],
    ],
  },
  // 중등부 MALE
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['중등부', 'GI', 'MALE', '화이트', '-48']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['중등부', 'GI', 'MALE', '화이트', '-48'],
      ['중등부', 'GI', 'MALE', '화이트', 'ABSOLUTE'],
    ],
  },
  // 중등부 FEMALE
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['중등부', 'GI', 'FEMALE', '화이트', '-43']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['중등부', 'GI', 'FEMALE', '화이트', '-43'],
      ['중등부', 'GI', 'FEMALE', '화이트', 'ABSOLUTE'],
    ],
  },
  // 고등부 MALE
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['고등부', 'GI', 'MALE', '화이트', '-53']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['고등부', 'GI', 'MALE', '화이트', '-53'],
      ['고등부', 'GI', 'MALE', '화이트', 'ABSOLUTE'],
    ],
  },
  // 고등부 FEMALE
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['고등부', 'GI', 'FEMALE', '화이트', '-43']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['고등부', 'GI', 'FEMALE', '화이트', '-43'],
      ['고등부', 'GI', 'FEMALE', '화이트', 'ABSOLUTE'],
    ],
  },
  // 어덜트 MALE
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['어덜트', 'GI', 'MALE', '화이트', '-58']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['노기통합', 'NOGI', 'MALE', '초급', '-50']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE']],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'MALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'MALE', '화이트', '-58'],
      ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
      ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
      ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
    ],
  },
  // 어덜트 FEMALE
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['어덜트', 'GI', 'FEMALE', '화이트', '-43']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['노기통합', 'NOGI', 'FEMALE', '초급', '-45']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE']],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
  {
    playerGender: 'FEMALE',
    playerBelt: '화이트',
    participationDivisionCombination: [
      ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
      ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
      ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
    ],
  },
];

const ADDITIONAL_INFO_VALUE_MAP = {
  SOCIAL_SECURITY_NUMBER: '980401-1234567',
  ADDRESS: '서울특별시 강남구 테헤란로 427',
};

const PLAYER_BIRTH_YEAR_OFFSET_MAP = {
  초등부12: 9,
  초등부34: 11,
  초등부56: 13,
  초등부123: 13,
  초등부456: 13,
  중등부: 16,
  고등부: 19,
  어덜트: 20,
  마스터: 30,
};

export class ApplicationDummyBuilder {
  private application: IApplication;

  constructor() {
    this.application = {
      id: uuidv7(),
      type: 'PROXY',
      userId: '',
      competitionId: '',
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      playerSnapshots: [],
      participationDivisionInfos: [],
      additionaInfos: [],
      applicationOrders: [],
    };
  }

  public setType(type: IApplication['type']): this {
    this.application.type = type;
    return this;
  }

  public setUserId(userId: string): this {
    this.application.userId = userId;
    return this;
  }

  public setCompetitionId(competitionId: string): this {
    this.application.competitionId = competitionId;
    return this;
  }

  public setStatus(status: IApplication['status']): this {
    this.application.status = status;
    return this;
  }

  public setPlayerSnapshots(playerSnapshotCreateDto: IPlayerSnapshotCreateDto): this {
    this.application.playerSnapshots = [
      {
        id: uuidv7(),
        applicationId: this.application.id,
        name: playerSnapshotCreateDto.name,
        gender: playerSnapshotCreateDto.gender,
        birth: playerSnapshotCreateDto.birth,
        phoneNumber: playerSnapshotCreateDto.phoneNumber,
        belt: playerSnapshotCreateDto.belt,
        network: playerSnapshotCreateDto.network,
        team: playerSnapshotCreateDto.team,
        masterName: playerSnapshotCreateDto.masterName,
        createdAt: new Date(),
      },
    ];
    return this;
  }

  public setParticipationDivisionInfos(competition: CompetitionModel, participationDivisionIds: string[]): this {
    const divisionModels = competition.getManyDivisions(participationDivisionIds);
    this.application.participationDivisionInfos = divisionModels.map((division) => {
      const participationDivisionInfoId = uuidv7();
      return {
        id: participationDivisionInfoId,
        applicationId: this.application.id,
        payedDivisionId: null,
        payedPriceSnapshotId: null,
        payedDivision: null,
        payedPriceSnapshot: null,
        status: 'READY',
        createdAt: new Date(),
        participationDivisionInfoSnapshots: [
          {
            id: uuidv7(),
            divisionId: division.id,
            division: division.toData(),
            participationDivisionInfoId,
            createdAt: new Date(),
          },
        ],
      };
    });
    return this;
  }

  public setAdditionalInfos(additionalInfoCreateDtos: IAdditionalInfoCreateDto[]): this {
    this.application.additionaInfos = additionalInfoCreateDtos.map((dto) => ({
      id: uuidv7(),
      applicationId: this.application.id,
      type: dto.type,
      value: dto.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    return this;
  }

  public build(): IApplication {
    return this.application;
  }
}

export class ApplicationDummyFactory {
  private user: IUser;
  private competition: ICompetition;

  constructor(user: IUser, competition: ICompetition) {
    this.user = user;
    this.competition = competition;
    if (this.competition.isPartnership === false) throw new Error('Competition is not partnership');
  }

  createProxyApplication(
    playerGender: IPlayerSnapshot['gender'],
    playerBelt: IPlayerSnapshot['belt'],
    participationDivisionCombination: IParticipationDivisionCombination,
  ): IApplication {
    return new ApplicationDummyBuilder()
      .setUserId(this.user.id)
      .setCompetitionId(this.competition.id)
      .setPlayerSnapshots(
        this.createPlayerSnapshotDto(playerGender, playerBelt, participationDivisionCombination[0][0]),
      )
      .setParticipationDivisionInfos(
        new CompetitionModel(this.competition),
        this.getExtractParticipationDivisionIds(participationDivisionCombination),
      )
      .setAdditionalInfos(this.createAdditionalInfos())
      .build();
  }

  private getExtractParticipationDivisionIds(
    participationDivisionCombination: IParticipationDivisionCombination,
  ): IDivision['id'][] {
    return participationDivisionCombination.map((unit) => {
      const [category, uniform, gender, belt, weight] = unit;
      const matchDivision = this.competition.divisions.find(
        (division) =>
          division.category === category &&
          division.uniform === uniform &&
          division.gender === gender &&
          division.belt === belt &&
          division.weight === weight,
      );
      if (!matchDivision) throw new Error(`Division not found: ${unit}`);
      return matchDivision.id;
    });
  }

  private createPlayerSnapshotDto(
    gender: IPlayerSnapshot['gender'],
    belt: IPlayerSnapshot['belt'],
    category: string,
  ): IPlayerSnapshotCreateDto {
    return {
      name: '대리신청 참가선수 이름',
      gender,
      birth: this.getPlayerBirth(category),
      phoneNumber: '01012345678',
      belt,
      network: '더미 주짓수 네트워크',
      team: '더미 소속 팀',
      masterName: '더미 관장님',
    };
  }

  private getPlayerBirth(category: string): string {
    const currentYear = new Date().getFullYear();
    const ageOffset = PLAYER_BIRTH_YEAR_OFFSET_MAP[category] || PLAYER_BIRTH_YEAR_OFFSET_MAP['어덜트'];
    return `${currentYear - ageOffset}0101`;
  }

  private createAdditionalInfos(): IAdditionalInfoCreateDto[] {
    if (this.competition.requiredAdditionalInfos.length === 0) return [];
    return this.competition.requiredAdditionalInfos.map((info) => ({
      type: info.type,
      value: ADDITIONAL_INFO_VALUE_MAP[info.type],
    }));
  }
}

export const generateDummyApplications = (user: IUser, competition: ICompetition): IApplication[] => {
  const applicationDummyFactory = new ApplicationDummyFactory(user, competition);
  return APPLICATION_DUMMY_CASE.map((dummy) => {
    return applicationDummyFactory.createProxyApplication(
      dummy.playerGender,
      dummy.playerBelt,
      dummy.participationDivisionCombination,
    );
  });
};
