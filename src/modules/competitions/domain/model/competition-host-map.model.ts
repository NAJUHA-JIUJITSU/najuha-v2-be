import { ICompetitionHostMapModelData } from '../interface/competition-host-map.interface';

export class CompetitionHostMapModel {
  private readonly id: ICompetitionHostMapModelData['id'];
  private readonly hostId: ICompetitionHostMapModelData['hostId'];
  private readonly competitionId: ICompetitionHostMapModelData['competitionId'];

  constructor(data: ICompetitionHostMapModelData) {
    this.id = data.id;
    this.hostId = data.hostId;
    this.competitionId = data.competitionId;
  }

  toData(): ICompetitionHostMapModelData {
    return {
      id: this.id,
      hostId: this.hostId,
      competitionId: this.competitionId,
    };
  }
}
