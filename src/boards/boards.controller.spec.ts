// src/boards/boards.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    // CAMBIO AQUÍ: de req.user.sub a req.user._id
    const userId = req.user._id;
    return this.boardsService.create(createBoardDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    // CAMBIO AQUÍ
    const userId = req.user._id;
    return this.boardsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // CAMBIO AQUÍ
    const userId = req.user._id;
    return this.boardsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Request() req) {
    // CAMBIO AQUÍ
    const userId = req.user._id;
    return this.boardsService.update(id, updateBoardDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // CAMBIO AQUÍ
    const userId = req.user._id;
    return this.boardsService.remove(id, userId);
  }
}