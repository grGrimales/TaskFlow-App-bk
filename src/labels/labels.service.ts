import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLabelDto } from './dto/create-label.dto';
import { Label, LabelDocument } from './schemas/label.schema';

const HARDCODED_LABELS: Label[] = [
  { name: 'Bug', color: '#d9534f', board: null, _id: '60d5ec9af682fbd170744481' } as any,
  { name: 'Feature', color: '#5cb85c', board: null, _id: '60d5ec9af682fbd170744482' } as any,
  { name: 'Mejora', color: '#5bc0de', board: null, _id: '60d5ec9af682fbd170744483' } as any,
  { name: 'Urgente', color: '#f0ad4e', board: null, _id: '60d5ec9af682fbd170744484' } as any,
];
@Injectable()
export class LabelsService {
  constructor(
    @InjectModel(Label.name) private labelModel: Model<LabelDocument>,
  ) {}

   async create(createLabelDto: CreateLabelDto): Promise<LabelDocument> {
    const createdLabel = new this.labelModel(createLabelDto);
    return createdLabel.save();
  }

  async findAllByBoard(boardId: string): Promise<Label[]> {
    return Promise.resolve(HARDCODED_LABELS);
  }

    async findOneByName(name: string, boardId: string): Promise<LabelDocument | null> {
    return this.labelModel.findOne({ name, board: boardId }).exec();
  }

  
}