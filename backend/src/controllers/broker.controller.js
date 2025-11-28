import { BrokerService } from '../services/broker.service.js';

export class BrokerController {
  static async createBrokerConnection(req, res, next) {
    try {
      const brokerData = { ...req.body, userId: req.user.id };
      const newConnection = await BrokerService.createBrokerConnection(brokerData);
      res.status(201).json({ 
        success: true,
        data: newConnection 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBrokerConnections(req, res, next) {
    try {
      const connections = await BrokerService.getBrokerConnectionsByUserId(req.user.id);
      res.status(200).json({ 
        success: true,
        data: connections 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBrokerConnection(req, res, next) {
    try {
      const connection = await BrokerService.getBrokerConnectionById(req.params.id);
      if (!connection) {
        return res.status(404).json({ 
          success: false,
          message: 'Broker connection not found' 
        });
      }
      
      // Check if user owns the connection
      if (connection.userId !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }
      
      res.status(200).json({ 
        success: true,
        data: connection 
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBrokerConnection(req, res, next) {
    try {
      const updatedConnection = await BrokerService.updateBrokerConnection(req.params.id, req.user.id, req.body);
      if (!updatedConnection) {
        return res.status(404).json({ 
          success: false,
          message: 'Broker connection not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        data: updatedConnection 
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBrokerConnection(req, res, next) {
    try {
      const success = await BrokerService.deleteBrokerConnection(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ 
          success: false,
          message: 'Broker connection not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        message: 'Broker connection deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  }

  static async syncTrades(req, res, next) {
    try {
      const connection = await BrokerService.getBrokerConnectionById(req.params.id);
      if (!connection) {
        return res.status(404).json({ 
          success: false,
          message: 'Broker connection not found' 
        });
      }
      
      // Check if user owns the connection
      if (connection.userId !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }
      
      const syncResult = await BrokerService.syncTradesFromBroker(connection);
      
      // Update last sync timestamp and status
      await BrokerService.updateBrokerConnection(req.params.id, req.user.id, {
        lastSync: new Date(),
        syncStatus: syncResult.success ? 'success' : 'failed'
      });
      
      res.status(200).json({ 
        success: true,
        message: `Successfully synced ${syncResult.tradesCount} trades`,
        data: syncResult
      });
    } catch (error) {
      next(error);
    }
  }
}