import { PlaybookModel } from '../models/playbook.model.js';

export class PlaybookService {
  static async createPlaybook(playbookData) {
    return await PlaybookModel.create(playbookData);
  }

  static async getPlaybookById(id) {
    return await PlaybookModel.findById(id);
  }

  static async getPlaybooksByUserId(userId) {
    return await PlaybookModel.findByUserId(userId);
  }

  static async getPublicPlaybooks() {
    return await PlaybookModel.findPublic();
  }

  static async updatePlaybook(id, userId, updateData) {
    return await PlaybookModel.update(id, userId, updateData);
  }

  static async deletePlaybook(id, userId) {
    return await PlaybookModel.delete(id, userId);
  }
}