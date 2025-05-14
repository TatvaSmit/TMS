import { Controller, Post, Put, Get, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    return this.taskService.createTask(createTaskDto.title, createTaskDto.description, req.user.id);
  }

  @Put(':id')
  async editTask(@Param('id') taskId: string, @Body() editTaskDto: EditTaskDto, @Req() req): Promise<Task> {
    return this.taskService.editTask(taskId, editTaskDto.title, editTaskDto.description, req.user.id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') taskId: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.updateStatus(
      taskId,
      updateStatusDto.status,
      req.user.id,
    );
  }

  @Get()
  async getTasks(
    @Req() req,
    @Query('search') search?: string,
    @Query('sort') sort: 'latest' | 'oldest' = 'latest',
  ): Promise<Task[]> {
    return this.taskService.getTasks(req.user.id, search, sort);
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: string, @Req() req): Promise<void> {
    return this.taskService.deleteTask(taskId, req.user.id);
  }
}
