// src-backend/comments/comments.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt')) // Proteger todas las rutas de este controlador
@Controller('tasks/:taskId/comments') // Anidar las rutas bajo las tareas
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any, // Para obtener el usuario del token
  ) {

    const userId = req.user._id; 
    return this.commentsService.create(createCommentDto, userId, taskId);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findAllByTask(taskId);
  }
}