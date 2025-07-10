// src/boards/boards.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateColumnOrderDto } from './dto/update-column-order.dto';
import { AddMemberDto } from './dto/add-member.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    // CAMBIO CLAVE: Convertir el ObjectId a string

    return this.boardsService.create(createBoardDto, req.user);
  }

  @Patch(':id/column-order')
  updateColumnOrder(
    @Param('id') id: string,
    @Body() updateColumnOrderDto: UpdateColumnOrderDto,
    @Request() req
  ) {
    const userId = req.user._id.toString();
    return this.boardsService.updateColumnOrder(id, updateColumnOrderDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    // CAMBIO CLAVE
    const userId = req.user._id.toString();
    return this.boardsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // CAMBIO CLAVE
    const userId = req.user._id.toString();
    return this.boardsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Request() req) {
    // CAMBIO CLAVE
    const userId = req.user._id.toString();
    return this.boardsService.update(id, updateBoardDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // CAMBIO CLAVE
    const userId = req.user._id.toString();
    return this.boardsService.remove(id, userId);
  }


  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req
  ) {
    const userId = req.user._id.toString();
    return this.boardsService.addMember(id, addMemberDto.email);
  }

}