// src-backend/labels/labels.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { Label, LabelSchema } from './schemas/label.schema'; // <-- Asegúrate de que esto esté correcto

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Label.name, schema: LabelSchema }]),
  ],
  controllers: [LabelsController],
  providers: [LabelsService],
  exports: [LabelsService], 
})
export class LabelsModule {}