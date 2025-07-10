// src/columns/columns.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('boards/:boardId/columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Request() req,
  ) {
    const userId = req.user._id.toString();
    return this.columnsService.create(boardId, createColumnDto, userId);
  }

  @Get()
  findAll(
    @Param('boardId') boardId: string,
    @Request() req
  ) {
    const userId = req.user._id.toString();
    return this.columnsService.findAllForBoard(boardId, userId);
  }

  // Nota: Para actualizar y eliminar, operamos directamente sobre el ID de la columna.
  // La ruta del controlador ya nos da el contexto del tablero, pero la acción es sobre la columna.
  // Por simplicidad, crearemos una ruta separada para estas acciones.
}

// Añadimos un nuevo controlador para las acciones directas sobre columnas
@UseGuards(AuthGuard('jwt'))
@Controller('columns') 
export class ColumnActionsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateColumnDto: CreateColumnDto, // Reutilizamos el DTO
    @Request() req,
  ) {
    const userId = req.user._id.toString();
    return this.columnsService.update(id, updateColumnDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req
  ) {
    const userId = req.user._id.toString();
    return this.columnsService.remove(id, userId);
  }
}
