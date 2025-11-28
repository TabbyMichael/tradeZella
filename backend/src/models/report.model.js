import { pool } from '../db.js';

export class ReportModel {
  static async create(reportData) {
    const client = await pool.connect();
    try {
      const {
        userId,
        name,
        description,
        template,
        dataFilters,
        scheduleFrequency,
        scheduleDay,
        scheduleTime,
        isPublic = false
      } = reportData;

      const result = await client.query(
        `INSERT INTO reports (
          userId, name, description, template, data_filters, 
          schedule_frequency, schedule_day, schedule_time, is_public
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          userId, name, description, JSON.stringify(template), JSON.stringify(dataFilters),
          scheduleFrequency, scheduleDay, scheduleTime, isPublic
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
          id, userId, name, description, template, data_filters as "dataFilters",
          schedule_frequency as "scheduleFrequency", schedule_day as "scheduleDay", 
          schedule_time as "scheduleTime", last_generated as "lastGenerated",
          next_scheduled as "nextScheduled", is_public as "isPublic",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM reports
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
          id, userId, name, description, template, data_filters as "dataFilters",
          schedule_frequency as "scheduleFrequency", schedule_day as "scheduleDay", 
          schedule_time as "scheduleTime", last_generated as "lastGenerated",
          next_scheduled as "nextScheduled", is_public as "isPublic",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM reports
         WHERE userId = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findScheduledReports() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, userId, name, description, template, data_filters as "dataFilters",
          schedule_frequency as "scheduleFrequency", schedule_day as "scheduleDay", 
          schedule_time as "scheduleTime", last_generated as "lastGenerated",
          next_scheduled as "nextScheduled", is_public as "isPublic",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM reports
         WHERE next_scheduled <= NOW()
         ORDER BY next_scheduled ASC`
      );

      return result.rows;
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
          if (key === 'template' || key === 'dataFilters') {
            fields.push(`${key} = $${index}`);
            values.push(JSON.stringify(updateData[key]));
          } else if (key === 'isPublic') {
            fields.push(`is_public = $${index}`);
            values.push(updateData[key]);
          } else if (key === 'lastGenerated') {
            fields.push(`last_generated = $${index}`);
            values.push(updateData[key]);
          } else if (key === 'nextScheduled') {
            fields.push(`next_scheduled = $${index}`);
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
        `UPDATE reports
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${index} AND userId = $${index + 1}
         RETURNING 
          id, userId, name, description, template, data_filters as "dataFilters",
          schedule_frequency as "scheduleFrequency", schedule_day as "scheduleDay", 
          schedule_time as "scheduleTime", last_generated as "lastGenerated",
          next_scheduled as "nextScheduled", is_public as "isPublic",
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
        'DELETE FROM reports WHERE id = $1 AND userId = $2',
        [id, userId]
      );

      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}