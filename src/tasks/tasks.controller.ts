// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { MoveTaskDto } from './dto/move-task.dto';
import { AssignUsersDto } from './dto/assign-users.dto';

// Controlador para crear tareas dentro de una columna específica
@UseGuards(AuthGuard('jwt'))
@Controller('columns/:columnId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(
    @Param('columnId') columnId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ) {
    const userId = req.user._id.toString();
    return this.tasksService.create(columnId, createTaskDto, userId);
  }
}

// Controlador para acciones sobre tareas específicas (actualizar, eliminar)
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TaskActionsController {
  constructor(private readonly tasksService: TasksService) { }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user._id.toString();
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req.user._id.toString();
    return this.tasksService.remove(id, userId);
  }

  @Patch(':id/move')
  move(
    @Param('id') id: string,
    @Body() moveTaskDto: MoveTaskDto,
    @Request() req
  ) {
    const userId = req.user._id.toString();
    return this.tasksService.move(id, moveTaskDto, userId);
  }

  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body() assignUsersDto: AssignUsersDto,
    @Request() req
  ) {
    const userId = req.user._id.toString();
    return this.tasksService.assignUsers(id, assignUsersDto, userId);
  }

}
