import { IPolicyModelData } from '../interface/policy.interface';

export class PolicyModel {
  private readonly _id: IPolicyModelData['id'];
  private readonly _version: IPolicyModelData['version'];
  private readonly _type: IPolicyModelData['type'];
  private readonly _isMandatory: IPolicyModelData['isMandatory'];
  private readonly _title: IPolicyModelData['title'];
  private readonly _content?: IPolicyModelData['content'];
  private readonly _createdAt: IPolicyModelData['createdAt'];

  constructor(data: IPolicyModelData) {
    this._id = data.id;
    this._version = data.version;
    this._type = data.type;
    this._isMandatory = data.isMandatory;
    this._title = data.title;
    this._content = data.content;
    this._createdAt = data.createdAt;
  }

  toData(): IPolicyModelData {
    return {
      id: this._id,
      version: this._version,
      type: this._type,
      isMandatory: this._isMandatory,
      title: this._title,
      content: this._content,
      createdAt: this._createdAt,
    };
  }

  get id() {
    return this._id;
  }

  get version() {
    return this._version;
  }

  get type() {
    return this._type;
  }

  get isMandatory() {
    return this._isMandatory;
  }

  get title() {
    return this._title;
  }

  get content() {
    return this._content;
  }

  get createdAt() {
    return this._createdAt;
  }
}
