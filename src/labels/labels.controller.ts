// src-backend/labels/labels.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('boards/:boardId/labels') // Anidamos las rutas bajo los tableros
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
 create(
    @Param('boardId') boardId: string,
    @Body() createLabelDto: CreateLabelDto,
  ) {
    createLabelDto.board = boardId;
    return this.labelsService.create(createLabelDto);
  }

  @Get()
  findAll(@Param('boardId') boardId: string) {
    return this.labelsService.findAllByBoard(boardId);
  }
}