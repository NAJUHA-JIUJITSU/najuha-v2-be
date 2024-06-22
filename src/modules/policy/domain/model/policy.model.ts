import { uuidv7 } from 'uuidv7';
import { IPolicyCreateDto, IPolicyModelData } from '../interface/policy.interface';

export class PolicyModel {
  private readonly id: IPolicyModelData['id'];
  private readonly version: IPolicyModelData['version'];
  private readonly type: IPolicyModelData['type'];
  private readonly isMandatory: IPolicyModelData['isMandatory'];
  private readonly title: IPolicyModelData['title'];
  private readonly content?: IPolicyModelData['content'];
  private readonly createdAt: IPolicyModelData['createdAt'];

  static create(dto: IPolicyCreateDto) {
    return new PolicyModel({
      id: uuidv7(),
      version: dto.version,
      type: dto.type,
      isMandatory: dto.isMandatory,
      title: dto.title,
      content: dto.content,
      createdAt: new Date(),
    });
  }

  constructor(data: IPolicyModelData) {
    this.id = data.id;
    this.version = data.version;
    this.type = data.type;
    this.isMandatory = data.isMandatory;
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }

  toData(): IPolicyModelData {
    return {
      id: this.id,
      version: this.version,
      type: this.type,
      isMandatory: this.isMandatory,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
    };
  }

  getId() {
    return this.id;
  }

  getVersion() {
    return this.version;
  }

  getType() {
    return this.type;
  }

  getIsMandatory() {
    return this.isMandatory;
  }
}
