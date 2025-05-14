import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task, TaskStatus } from './task.schema';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;

  const mockTaskModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockTask = {
    _id: 'task_id',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.CREATED,
    userId: 'user_id',
  } as Task;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const title = 'Test Task';
      const description = 'Test Description';
      const userId = 'user_id';
      
      const createdTask = { 
        _id: 'task_id', 
        title, 
        description, 
        status: TaskStatus.CREATED,
        userId,
      } as Task;

      jest.spyOn(service, 'createTask').mockResolvedValue(createdTask);

      const result = await service.createTask(title, description, userId);

      expect(result).toEqual(createdTask);
      expect(service.createTask).toHaveBeenCalledWith(title, description, userId);
    });
  });

  describe('editTask', () => {
    it('should throw NotFoundException if task not found', async () => {
      const taskId = 'task_id';
      const title = 'Updated Task';
      const description = 'Updated Description';
      const userId = 'user_id';

      jest.spyOn(service, 'editTask').mockRejectedValue(new NotFoundException('Task not found or unauthorized'));

      await expect(service.editTask(taskId, title, description, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should update and return the task if found', async () => {
      const taskId = 'task_id';
      const title = 'Updated Task';
      const description = 'Updated Description';
      const userId = 'user_id';
      
      const updatedTask = {
        _id: taskId,
        title,
        description,
        status: TaskStatus.CREATED,
        userId,
      } as Task;

      jest.spyOn(service, 'editTask').mockResolvedValue(updatedTask);

      const result = await service.editTask(taskId, title, description, userId);

      expect(result).toEqual(updatedTask);
      expect(service.editTask).toHaveBeenCalledWith(taskId, title, description, userId);
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException if task not found', async () => {
      const taskId = 'task_id';
      const status = TaskStatus.INPROGRESS;
      const userId = 'user_id';

      jest.spyOn(service, 'updateStatus').mockRejectedValue(new NotFoundException('Task not found or unauthorized'));

      await expect(service.updateStatus(taskId, status, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should update status and return the task if found', async () => {
      const taskId = 'task_id';
      const status = TaskStatus.INPROGRESS;
      const userId = 'user_id';
      
      const updatedTask = {
        _id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status,
        userId,
      } as Task;

      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedTask);

      const result = await service.updateStatus(taskId, status, userId);

      expect(result).toEqual(updatedTask);
      expect(service.updateStatus).toHaveBeenCalledWith(taskId, status, userId);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks for a user when no search is provided', async () => {
      const userId = 'user_id';
      const tasks = [
        { ...mockTask, _id: 'task1' },
        { ...mockTask, _id: 'task2' },
      ];

      const execMock = jest.fn().mockResolvedValue(tasks);
      const sortMock = { exec: execMock };
      
      mockTaskModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue(sortMock),
      });

      const result = await service.getTasks(userId);

      expect(mockTaskModel.find).toHaveBeenCalledWith({ userId });
      expect(mockTaskModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(tasks);
    });

    it('should filter tasks by search term when provided', async () => {
      const userId = 'user_id';
      const searchTerm = 'test';
      const tasks = [
        { ...mockTask, _id: 'task1', title: 'Test Task' },
      ];

      const execMock = jest.fn().mockResolvedValue(tasks);
      const sortMock = { exec: execMock };
      
      mockTaskModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue(sortMock),
      });

      const result = await service.getTasks(userId, searchTerm);

      expect(mockTaskModel.find).toHaveBeenCalledWith({
        userId,
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
      });
      expect(result).toEqual(tasks);
    });

    it('should sort tasks by oldest first when specified', async () => {
      const userId = 'user_id';
      const tasks = [
        { ...mockTask, _id: 'task1' },
        { ...mockTask, _id: 'task2' },
      ];

      const execMock = jest.fn().mockResolvedValue(tasks);
      const sortMock = { exec: execMock };
      
      mockTaskModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue(sortMock),
      });

      const result = await service.getTasks(userId, undefined, 'oldest');

      expect(mockTaskModel.find).toHaveBeenCalledWith({ userId });
      expect(mockTaskModel.find().sort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(result).toEqual(tasks);
    });
  });

  describe('deleteTask', () => {
    it('should throw NotFoundException if task not found or not authorized', async () => {
      const taskId = 'task_id';
      const userId = 'user_id';

      mockTaskModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.deleteTask(taskId, userId))
        .rejects.toThrow(NotFoundException);
      expect(mockTaskModel.deleteOne).toHaveBeenCalledWith({ _id: taskId, userId });
    });

    it('should delete the task if found and authorized', async () => {
      const taskId = 'task_id';
      const userId = 'user_id';

      mockTaskModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await service.deleteTask(taskId, userId);

      expect(mockTaskModel.deleteOne).toHaveBeenCalledWith({ _id: taskId, userId });
    });
  });
}); 