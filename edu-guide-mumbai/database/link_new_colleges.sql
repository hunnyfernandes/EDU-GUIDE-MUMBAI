-- Link newly added colleges to streams and add courses
-- This script uses the actual college names to find the correct IDs

USE test;

-- Link colleges to streams using college names
INSERT INTO college_streams (college_id, stream_id)
SELECT c.college_id, s.stream_id
FROM colleges c
CROSS JOIN streams s
WHERE 
  (c.college_name = 'IIT Bombay' AND s.stream_name IN ('Engineering', 'Information Technology'))
  OR (c.college_name = 'SIES College of Arts, Science and Commerce' AND s.stream_name IN ('Commerce', 'Arts', 'Science'))
  OR (c.college_name = 'Sophia College for Women' AND s.stream_name IN ('Commerce', 'Arts', 'Science'))
  OR (c.college_name = 'Sydenham College of Commerce and Economics' AND s.stream_name = 'Commerce')
  OR (c.college_name = 'Sardar Patel Institute of Technology' AND s.stream_name IN ('Engineering', 'Information Technology'))
  OR (c.college_name = 'Dwarkadas J. Sanghvi College of Engineering' AND s.stream_name IN ('Engineering', 'Information Technology'))
  OR (c.college_name = 'Vivekanand Education Society\'s Institute of Technology' AND s.stream_name IN ('Engineering', 'Information Technology'))
  OR (c.college_name = 'Elphinstone College' AND s.stream_name IN ('Arts', 'Science'))
  OR (c.college_name = 'Narsee Monjee College of Commerce and Economics' AND s.stream_name = 'Commerce')
ON DUPLICATE KEY UPDATE college_stream_id=college_stream_id;

-- Add sample courses for IIT Bombay
INSERT INTO courses (college_id, stream_id, course_name, course_code, degree_type, duration_years, total_seats, fees_per_year, eligibility, description)
SELECT 
  c.college_id,
  s.stream_id,
  'Bachelor of Technology in Computer Science',
  'BTECHCS',
  'Undergraduate',
  4.0,
  100,
  220000.00,
  'JEE Advanced with top rank',
  'Premier computer science program with world-class faculty and research'
FROM colleges c
JOIN streams s ON s.stream_name = 'Engineering'
WHERE c.college_name = 'IIT Bombay'
LIMIT 1;

-- Add course for Sophia College
INSERT INTO courses (college_id, stream_id, course_name, course_code, degree_type, duration_years, total_seats, fees_per_year, eligibility, description)
SELECT 
  c.college_id,
  s.stream_id,
  'Bachelor of Commerce',
  'BCOM',
  'Undergraduate',
  3.0,
  120,
  42000.00,
  'HSC with minimum 60%',
  'Commerce program for women with focus on leadership'
FROM colleges c
JOIN streams s ON s.stream_name = 'Commerce'
WHERE c.college_name = 'Sophia College for Women'
LIMIT 1;

-- Add courses for Sydenham
INSERT INTO courses (college_id, stream_id, course_name, course_code, degree_type, duration_years, total_seats, fees_per_year, eligibility, description)
SELECT 
  c.college_id,
  s.stream_id,
  'Bachelor of Commerce',
  'BCOM',
  'Undergraduate',
  3.0,
  200,
  46000.00,
  'HSC with minimum 65%',
  'Premier commerce education with heritage'
FROM colleges c
JOIN streams s ON s.stream_name = 'Commerce'
WHERE c.college_name = 'Sydenham College of Commerce and Economics'
LIMIT 1;

SELECT 'Successfully linked colleges to streams and added sample courses!' as Status;
