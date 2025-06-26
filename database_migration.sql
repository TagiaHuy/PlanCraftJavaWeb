-- Migration script to add progress_percentage column to stages table
-- Run this script in your MySQL database

-- Add progress_percentage column to stages table
ALTER TABLE stages ADD COLUMN progress_percentage DECIMAL(5,2) DEFAULT 0.0;

-- Update existing stages with calculated progress
UPDATE stages s 
SET progress_percentage = (
    SELECT 
        CASE 
            WHEN COUNT(t.id) = 0 THEN 0.0
            ELSE ROUND((COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(t.id)), 2)
        END
    FROM tasks t 
    WHERE t.stage_id = s.id
);

-- Create index for better performance
CREATE INDEX idx_stages_progress ON stages(progress_percentage);

-- Verify the migration
SELECT 
    s.id,
    s.name,
    s.progress_percentage,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) as completed_tasks
FROM stages s
LEFT JOIN tasks t ON s.id = t.stage_id
GROUP BY s.id, s.name, s.progress_percentage
ORDER BY s.id; 