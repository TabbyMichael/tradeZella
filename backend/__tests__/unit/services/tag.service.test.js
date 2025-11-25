import { TagService } from '../../../src/services/tag.service.js';
import { TagModel } from '../../../src/models/tag.model.js';

// Mock the TagModel
jest.mock('../../../src/models/tag.model.js');

describe('TagService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createTag', () => {
    it('should create a new tag when valid data is provided', async () => {
      const tagData = {
        name: 'Test Tag',
        slug: 'test-tag'
      };
      
      const createdTag = { id: 1, ...tagData, usage_count: 0 };
      
      TagModel.findBySlug.mockResolvedValue(null);
      TagModel.create.mockResolvedValue(createdTag);
      
      const result = await TagService.createTag(tagData);
      
      expect(TagModel.findBySlug).toHaveBeenCalledWith(tagData.slug);
      expect(TagModel.create).toHaveBeenCalledWith(tagData);
      expect(result).toEqual(createdTag);
    });
    
    it('should throw an error when name is missing', async () => {
      const tagData = {
        slug: 'test-tag'
      };
      
      await expect(TagService.createTag(tagData))
        .rejects
        .toThrow('Name and slug are required');
    });
    
    it('should throw an error when slug is missing', async () => {
      const tagData = {
        name: 'Test Tag'
      };
      
      await expect(TagService.createTag(tagData))
        .rejects
        .toThrow('Name and slug are required');
    });
    
    it('should throw an error when tag with slug already exists', async () => {
      const tagData = {
        name: 'Test Tag',
        slug: 'test-tag'
      };
      
      const existingTag = { id: 1, ...tagData, usage_count: 0 };
      
      TagModel.findBySlug.mockResolvedValue(existingTag);
      
      await expect(TagService.createTag(tagData))
        .rejects
        .toThrow('Tag with this slug already exists');
    });
  });
  
  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const tags = [
        { id: 1, name: 'Tag 1', slug: 'tag-1', usage_count: 5 },
        { id: 2, name: 'Tag 2', slug: 'tag-2', usage_count: 3 }
      ];
      
      TagModel.findAll.mockResolvedValue(tags);
      
      const result = await TagService.getAllTags();
      
      expect(TagModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(tags);
    });
  });
  
  describe('getTagBySlug', () => {
    it('should return a tag by slug', async () => {
      const tag = { id: 1, name: 'Test Tag', slug: 'test-tag', usage_count: 0 };
      
      TagModel.findBySlug.mockResolvedValue(tag);
      
      const result = await TagService.getTagBySlug('test-tag');
      
      expect(TagModel.findBySlug).toHaveBeenCalledWith('test-tag');
      expect(result).toEqual(tag);
    });
  });
  
  describe('getTagsByThreadId', () => {
    it('should return all tags for a thread', async () => {
      const tags = [
        { id: 1, name: 'Tag 1', slug: 'tag-1' },
        { id: 2, name: 'Tag 2', slug: 'tag-2' }
      ];
      
      TagModel.findByThreadId.mockResolvedValue(tags);
      
      const result = await TagService.getTagsByThreadId(1);
      
      expect(TagModel.findByThreadId).toHaveBeenCalledWith(1);
      expect(result).toEqual(tags);
    });
  });
  
  describe('addTagToThread', () => {
    it('should add a tag to a thread', async () => {
      const association = { thread_id: 1, tag_id: 1 };
      
      TagModel.addTagToThread.mockResolvedValue(association);
      
      const result = await TagService.addTagToThread(1, 1);
      
      expect(TagModel.addTagToThread).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(association);
    });
  });
  
  describe('removeTagFromThread', () => {
    it('should remove a tag from a thread', async () => {
      const association = { thread_id: 1, tag_id: 1 };
      
      TagModel.removeTagFromThread.mockResolvedValue(association);
      
      const result = await TagService.removeTagFromThread(1, 1);
      
      expect(TagModel.removeTagFromThread).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(association);
    });
  });
});