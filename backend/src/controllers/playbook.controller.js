import { PlaybookService } from '../services/playbook.service.js';

export class PlaybookController {
  static async createPlaybook(req, res, next) {
    try {
      const playbookData = { ...req.body, userId: req.user.id };
      const newPlaybook = await PlaybookService.createPlaybook(playbookData);
      res.status(201).json({ 
        success: true,
        data: newPlaybook 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPlaybooks(req, res, next) {
    try {
      const playbooks = await PlaybookService.getPlaybooksByUserId(req.user.id);
      res.status(200).json({ 
        success: true,
        data: playbooks 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicPlaybooks(req, res, next) {
    try {
      const playbooks = await PlaybookService.getPublicPlaybooks();
      res.status(200).json({ 
        success: true,
        data: playbooks 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPlaybook(req, res, next) {
    try {
      const playbook = await PlaybookService.getPlaybookById(req.params.id);
      if (!playbook) {
        return res.status(404).json({ 
          success: false,
          message: 'Playbook not found' 
        });
      }
      
      // Check if user owns the playbook or if it's public
      if (playbook.userId !== req.user.id && !playbook.isPublic) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }
      
      res.status(200).json({ 
        success: true,
        data: playbook 
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePlaybook(req, res, next) {
    try {
      const updatedPlaybook = await PlaybookService.updatePlaybook(req.params.id, req.user.id, req.body);
      if (!updatedPlaybook) {
        return res.status(404).json({ 
          success: false,
          message: 'Playbook not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        data: updatedPlaybook 
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePlaybook(req, res, next) {
    try {
      const success = await PlaybookService.deletePlaybook(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ 
          success: false,
          message: 'Playbook not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        message: 'Playbook deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  }
}