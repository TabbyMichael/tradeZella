-- Add full-text search capabilities to threads table
ALTER TABLE threads
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create a GIN index for efficient full-text search
CREATE INDEX IF NOT EXISTS idx_threads_search_vector ON threads USING GIN(search_vector);

-- Create a function to update the search vector
CREATE OR REPLACE FUNCTION update_thread_search_vector() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the search vector on insert or update
DROP TRIGGER IF EXISTS trigger_update_thread_search_vector ON threads;
CREATE TRIGGER trigger_update_thread_search_vector
  BEFORE INSERT OR UPDATE ON threads
  FOR EACH ROW EXECUTE FUNCTION update_thread_search_vector();

-- Populate search vectors for existing threads
UPDATE threads SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(content, '')), 'B');