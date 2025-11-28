-- Add Playbooks table
CREATE TABLE IF NOT EXISTS playbooks (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  strategy TEXT, -- Natural language strategy definition
  rules JSONB, -- Structured rules for the playbook
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

-- Add Backtesting Results table
CREATE TABLE IF NOT EXISTS backtesting_results (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  playbookId INTEGER,
  name VARCHAR(255) NOT NULL,
  strategy TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  initial_capital DECIMAL(15,2),
  final_capital DECIMAL(15,2),
  total_trades INTEGER,
  winning_trades INTEGER,
  losing_trades INTEGER,
  win_rate DECIMAL(5,2),
  profit_factor DECIMAL(10,2),
  max_drawdown DECIMAL(10,2),
  sharpe_ratio DECIMAL(10,2),
  results JSONB, -- Detailed results data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (playbookId) REFERENCES playbooks (id) ON DELETE SET NULL
);

-- Add Reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template JSONB, -- Report structure and components
  data_filters JSONB, -- Filters used to generate the report
  schedule_frequency VARCHAR(50), -- daily, weekly, monthly, etc.
  schedule_day INTEGER, -- Day of week or month for scheduling
  schedule_time TIME, -- Time of day for scheduling
  last_generated TIMESTAMP,
  next_scheduled TIMESTAMP,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

-- Add Broker Connections table
CREATE TABLE IF NOT EXISTS broker_connections (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  broker_name VARCHAR(100) NOT NULL,
  broker_type VARCHAR(50) NOT NULL, -- api, file_upload, manual
  connection_details JSONB, -- Encrypted connection credentials
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP,
  sync_status VARCHAR(50), -- success, failed, in_progress
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

-- Add AI Analysis Results table
CREATE TABLE IF NOT EXISTS ai_analysis_results (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  tradeId INTEGER,
  playbookId INTEGER,
  analysis_type VARCHAR(100) NOT NULL, -- trade_review, strategy_evaluation, market_outlook
  input_data JSONB, -- Data used for analysis
  results JSONB, -- AI-generated insights
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (tradeId) REFERENCES trades (id) ON DELETE SET NULL,
  FOREIGN KEY (playbookId) REFERENCES playbooks (id) ON DELETE SET NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_playbooks_userId ON playbooks(userId);
CREATE INDEX IF NOT EXISTS idx_backtesting_results_userId ON backtesting_results(userId);
CREATE INDEX IF NOT EXISTS idx_reports_userId ON reports(userId);
CREATE INDEX IF NOT EXISTS idx_broker_connections_userId ON broker_connections(userId);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_userId ON ai_analysis_results(userId);