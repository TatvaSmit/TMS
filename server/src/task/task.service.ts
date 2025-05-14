import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskStatus } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(title: string, description: string, userId: string): Promise<Task> {
    const existingTask = await this.taskModel.findOne({
      title: title.trim(),
      userId: userId,
    }).lean();
   
    if (existingTask) {
      throw new HttpException('Task with the same title already exists', HttpStatus.CONFLICT);
    }
    const task = new this.taskModel({ title, description, userId });
    return task.save();
  }

  async editTask(taskId: string, title: string, description: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: taskId, userId });
    if (!task) {
      throw new NotFoundException('Task not found or unauthorized');
    }
    task.title = title;
    task.description = description;
    return task.save();
  }

  async updateStatus(taskId: string, status: TaskStatus, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: taskId, userId });
    if (!task) {
      throw new NotFoundException('Task not found or unauthorized');
    }
    if(task.status === TaskStatus.CREATED && status === TaskStatus.COMPLETED){
      throw new HttpException("To complete this task, please move it to In Progress first.",HttpStatus.BAD_REQUEST)
    }
    task.status = status;
    return task.save();
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: taskId, userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found or unauthorized');
    }
  }

  async getTasks(
    userId: string,
    search?: string,
    sort: 'latest' | 'oldest' = 'latest',
  ): Promise<Task[]> {
    const query: any = { userId };
  
    if (search && search.trim() !== '') {
      const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ];
    }
    const sortOption = sort === 'latest' ? -1 : 1;
    return this.taskModel.find(query).sort({ createdAt: sortOption }).exec();
  }
} 