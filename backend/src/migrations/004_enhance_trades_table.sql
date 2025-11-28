-- Add trade_date column to trades table
ALTER TABLE trades
ADD COLUMN IF NOT EXISTS trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add tags column to trades table
ALTER TABLE trades
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add sentiment column to trades table
ALTER TABLE trades
ADD COLUMN IF NOT EXISTS sentiment TEXT;

-- Add screenshots column to trades table
ALTER TABLE trades
ADD COLUMN IF NOT EXISTS screenshots TEXT[];
