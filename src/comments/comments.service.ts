// src-backend/comments/comments.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string, taskId: string): Promise<Comment> {
    const newComment = new this.commentModel({
      ...createCommentDto,
      author: authorId,
      task: taskId,
    });
    const savedComment = await newComment.save();
    // Populate author details before returning
    return savedComment.populate('author', 'name email');
  }

  async findAllByTask(taskId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ task: taskId })
      .populate('author', 'name email') // Trae los datos del autor
      .sort({ createdAt: 'asc' }) // Ordena del más antiguo al más nuevo
      .exec();
  }
}