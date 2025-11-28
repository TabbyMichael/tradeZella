import { ReportService } from '../services/report.service.js';

export class ReportController {
  static async createReport(req, res, next) {
    try {
      const reportData = { ...req.body, userId: req.user.id };
      const newReport = await ReportService.createReport(reportData);
      res.status(201).json({ 
        success: true,
        data: newReport 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReports(req, res, next) {
    try {
      const reports = await ReportService.getReportsByUserId(req.user.id);
      res.status(200).json({ 
        success: true,
        data: reports 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReport(req, res, next) {
    try {
      const report = await ReportService.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ 
          success: false,
          message: 'Report not found' 
        });
      }
      
      // Check if user owns the report or if it's public
      if (report.userId !== req.user.id && !report.isPublic) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }
      
      res.status(200).json({ 
        success: true,
        data: report 
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateReport(req, res, next) {
    try {
      const updatedReport = await ReportService.updateReport(req.params.id, req.user.id, req.body);
      if (!updatedReport) {
        return res.status(404).json({ 
          success: false,
          message: 'Report not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        data: updatedReport 
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReport(req, res, next) {
    try {
      const success = await ReportService.deleteReport(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ 
          success: false,
          message: 'Report not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        message: 'Report deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateReportData(req, res, next) {
    try {
      const reportData = await ReportService.generateReportData(req.body.filters);
      res.status(200).json({ 
        success: true,
        data: reportData 
      });
    } catch (error) {
      next(error);
    }
  }
}