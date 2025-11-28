import { pool } from '../db.js';

export class BrokerModel {
  static async create(brokerData) {
    const client = await pool.connect();
    try {
      const {
        userId,
        brokerName,
        brokerType,
        connectionDetails,
        isActive = true
      } = brokerData;

      const result = await client.query(
        `INSERT INTO broker_connections (
          userId, broker_name, broker_type, connection_details, is_active
        )
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          userId, brokerName, brokerType, JSON.stringify(connectionDetails), isActive
        ]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, userId, broker_name as "brokerName", broker_type as "brokerType", 
          connection_details as "connectionDetails", is_active as "isActive",
          last_sync as "lastSync", sync_status as "syncStatus",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM broker_connections
         WHERE id = $1`,
        [id]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, userId, broker_name as "brokerName", broker_type as "brokerType", 
          connection_details as "connectionDetails", is_active as "isActive",
          last_sync as "lastSync", sync_status as "syncStatus",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM broker_connections
         WHERE userId = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByUserIdAndBrokerName(userId, brokerName) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, userId, broker_name as "brokerName", broker_type as "brokerType", 
          connection_details as "connectionDetails", is_active as "isActive",
          last_sync as "lastSync", sync_status as "syncStatus",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM broker_connections
         WHERE userId = $1 AND broker_name = $2`,
        [userId, brokerName]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, userId, updateData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (key === 'connectionDetails') {
            fields.push(`connection_details = $${index}`);
            values.push(JSON.stringify(updateData[key]));
          } else if (key === 'brokerName') {
            fields.push(`broker_name = $${index}`);
            values.push(updateData[key]);
          } else if (key === 'brokerType') {
            fields.push(`broker_type = $${index}`);
            values.push(updateData[key]);
          } else if (key === 'isActive') {
            fields.push(`is_active = $${index}`);
            values.push(updateData[key]);
          } else if (key === 'lastSync') {
            fields.push(`last_sync = $${index}`);
            values.push(updateData[key]);
          } else if (key === 'syncStatus') {
            fields.push(`sync_status = $${index}`);
            values.push(updateData[key]);
          } else {
            fields.push(`${key} = $${index}`);
            values.push(updateData[key]);
          }
          index++;
        }
      });

      if (fields.length === 0) {
        return await this.findById(id);
      }

      values.push(id, userId);
      const result = await client.query(
        `UPDATE broker_connections
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${index} AND userId = $${index + 1}
         RETURNING 
          id, userId, broker_name as "brokerName", broker_type as "brokerType", 
          connection_details as "connectionDetails", is_active as "isActive",
          last_sync as "lastSync", sync_status as "syncStatus",
          created_at as "createdAt", updated_at as "updatedAt"`,
        values
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id, userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM broker_connections WHERE id = $1 AND userId = $2',
        [id, userId]
      );

      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}