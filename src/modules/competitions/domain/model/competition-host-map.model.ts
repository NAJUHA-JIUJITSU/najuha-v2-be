import { ICompetitionHostMapModelData } from '../interface/competition-host-map.interface';

export class CompetitionHostMapModel {
  /** properties */
  private readonly _id: ICompetitionHostMapModelData['id'];
  private readonly _hostId: ICompetitionHostMapModelData['hostId'];
  private readonly _competitionId: ICompetitionHostMapModelData['competitionId'];

  constructor(data: ICompetitionHostMapModelData) {
    this._id = data.id;
    this._hostId = data.hostId;
    this._competitionId = data.competitionId;
  }

  toData(): ICompetitionHostMapModelData {
    return {
      id: this._id,
      hostId: this._hostId,
      competitionId: this._competitionId,
    };
  }

  get id() {
    return this._id;
  }

  get hostId() {
    return this._hostId;
  }

  get competitionId() {
    return this._competitionId;
  }
}
