-- Sample Data for Edu Guide Mumbai

USE edu_guide_mumbai;

-- Sample Users
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES
('Admin User', 'admin@eduguide.com', '$2b$10$rI7zXz9wH2XpKwKoP1qLz.9qKQJ3hqkL8mK9xN0pQ1rL2sM3tN4uO', '9876543210', 'admin'),
('Rahul Sharma', 'rahul.sharma@email.com', '$2b$10$rI7zXz9wH2XpKwKoP1qLz.9qKQJ3hqkL8mK9xN0pQ1rL2sM3tN4uO', '9876543211', 'student'),
('Priya Patel', 'priya.patel@email.com', '$2b$10$rI7zXz9wH2XpKwKoP1qLz.9qKQJ3hqkL8mK9xN0pQ1rL2sM3tN4uO', '9876543212', 'student'),
('Arjun Mehta', 'arjun.mehta@email.com', '$2b$10$rI7zXz9wH2XpKwKoP1qLz.9qKQJ3hqkL8mK9xN0pQ1rL2sM3tN4uO', '9876543213', 'student');

-- Sample Colleges
INSERT INTO colleges (college_name, college_code, address, pincode, phone, email, website, established_year, college_type, affiliation, description, average_rating, total_reviews, status) VALUES
('St. Xavier''s College', 'SXC001', '5, Mahapalika Marg, Dhobi Talao, Marine Lines', '400001', '022-22620661', 'info@xaviers.edu', 'www.xaviers.edu', 1869, 'Autonomous', 'University of Mumbai', 'St. Xavier''s College is one of the premier educational institutions in Mumbai, known for its academic excellence and rich tradition spanning over 150 years.', 4.5, 125, 'active'),
('HR College of Commerce and Economics', 'HRC001', '123, Dinshaw Vachha Road, Churchgate', '400020', '022-22821652', 'principal@hrcollege.edu', 'www.hrcollege.edu', 1960, 'Autonomous', 'University of Mumbai', 'HR College is renowned for commerce education and has consistently maintained high academic standards with excellent placement records.', 4.3, 98, 'active'),
('Jai Hind College', 'JHC001', 'A Road, Churchgate', '400020', '022-22821897', 'info@jaihindcollege.com', 'www.jaihindcollege.com', 1948, 'Autonomous', 'University of Mumbai', 'Jai Hind College has been a pioneer in providing quality education in arts, science, and commerce streams with a focus on holistic development.', 4.2, 87, 'active'),
('KC College', 'KCC001', 'Dinshaw Wachha Road, Churchgate', '400020', '022-22820092', 'office@kccollege.edu.in', 'www.kccollege.edu.in', 1954, 'Aided', 'University of Mumbai', 'KC College offers diverse programs in arts, commerce, and science with modern infrastructure and experienced faculty.', 4.1, 76, 'active'),
('Mithibai College', 'MC001', 'Bhaktivedanta Swami Road, Vile Parle (W)', '400056', '022-26707407', 'principal@mithibai.ac.in', 'www.mithibai.ac.in', 1961, 'Autonomous', 'University of Mumbai', 'Mithibai College is known for its excellent academic programs and vibrant campus life with strong emphasis on extracurricular activities.', 4.4, 112, 'active'),
('VJTI - Veermata Jijabai Technological Institute', 'VJTI001', 'Matunga, Mumbai', '400019', '022-24198125', 'registrar@vjti.ac.in', 'www.vjti.ac.in', 1887, 'Government', 'University of Mumbai', 'VJTI is one of the oldest and most prestigious engineering institutions in India, known for producing top-quality engineers and technologists.', 4.6, 156, 'active'),
('Narsee Monjee Institute of Management Studies', 'NMIMS001', 'V.L. Mehta Road, Vile Parle (W)', '400056', '022-42351000', 'admissions@nmims.edu', 'www.nmims.edu', 1981, 'Private', 'Deemed University', 'NMIMS is a leading management and professional education institution offering diverse programs with excellent industry connections.', 4.5, 142, 'active'),
('K.J. Somaiya College of Engineering', 'KJSCE001', 'Vidyavihar, Ghatkopar East', '400077', '022-67728000', 'kjsce@somaiya.edu', 'www.kjsce.somaiya.edu', 1983, 'Autonomous', 'University of Mumbai', 'KJSCE is known for its quality engineering education with modern labs, experienced faculty, and strong placement records.', 4.3, 98, 'active'),
('Wilson College', 'WC001', 'Chowpatty Sea Face', '400007', '022-23630919', 'principal@wilsoncollege.edu', 'www.wilsoncollege.edu', 1832, 'Aided', 'University of Mumbai', 'One of Mumbai''s oldest colleges, Wilson College offers programs in arts and science with a heritage campus and quality education.', 4.0, 68, 'active'),
('Ramnarain Ruia Autonomous College', 'RRAC001', 'L.N. Road, Matunga', '400019', '022-24157000', 'info@ruiacollege.edu', 'www.ruiacollege.edu', 1937, 'Autonomous', 'University of Mumbai', 'Ruia College is known for its science programs and research facilities with a strong academic tradition.', 4.2, 89, 'active');

-- Link Colleges to Streams
INSERT INTO college_streams (college_id, stream_id) VALUES
-- St. Xavier's (Arts, Science, Commerce)
(1, 1), (1, 2), (1, 3),
-- HR College (Commerce)
(2, 1),
-- Jai Hind (Arts, Commerce, Science)
(3, 1), (3, 2), (3, 3),
-- KC College (Arts, Commerce, Science)
(4, 1), (4, 2), (4, 3),
-- Mithibai (Arts, Commerce, Science)
(5, 1), (5, 2), (5, 3),
-- VJTI (Engineering, IT)
(6, 5), (6, 6),
-- NMIMS (Management, Commerce)
(7, 1), (7, 4),
-- KJSCE (Engineering, IT)
(8, 5), (8, 6),
-- Wilson (Arts, Science)
(9, 2), (9, 3),
-- Ruia (Science, Arts)
(10, 2), (10, 3);

-- Sample Courses
INSERT INTO courses (college_id, stream_id, course_name, course_code, degree_type, duration_years, total_seats, fees_per_year, eligibility, description) VALUES
-- St. Xavier's
(1, 1, 'Bachelor of Commerce', 'BCOM', 'Undergraduate', 3.0, 240, 45000.00, 'HSC with minimum 60% in commerce subjects', 'Comprehensive commerce program with specializations in Accounting, Finance, and Management'),
(1, 3, 'Bachelor of Science in Computer Science', 'BSCCS', 'Undergraduate', 3.0, 120, 55000.00, 'HSC with minimum 60% in Science with Mathematics', 'Advanced computer science program with focus on programming and technology'),
(1, 2, 'Bachelor of Arts in Economics', 'BAECO', 'Undergraduate', 3.0, 100, 40000.00, 'HSC with minimum 50%', 'Economics program with focus on economic theory and applications'),

-- HR College
(2, 1, 'Bachelor of Commerce', 'BCOM', 'Undergraduate', 3.0, 180, 48000.00, 'HSC with minimum 65% in commerce', 'Premier commerce education with focus on practical applications'),
(2, 1, 'Bachelor of Management Studies', 'BMS', 'Undergraduate', 3.0, 120, 52000.00, 'HSC with minimum 60%', 'Management program with industry exposure and internships'),

-- VJTI
(6, 5, 'Bachelor of Technology in Computer Engineering', 'BTECHCE', 'Undergraduate', 4.0, 120, 85000.00, 'JEE Main with valid score', 'Premier engineering program with cutting-edge curriculum and research opportunities'),
(6, 5, 'Bachelor of Technology in Mechanical Engineering', 'BTECHME', 'Undergraduate', 4.0, 90, 85000.00, 'JEE Main with valid score', 'Comprehensive mechanical engineering program with modern labs'),
(6, 6, 'Bachelor of Technology in Information Technology', 'BTECHIT', 'Undergraduate', 4.0, 60, 85000.00, 'JEE Main with valid score', 'IT program focusing on software development and emerging technologies'),

-- NMIMS
(7, 4, 'Master of Business Administration', 'MBA', 'Postgraduate', 2.0, 180, 325000.00, 'Graduate with valid CAT/XAT/GMAT score', 'Top-tier MBA program with excellent placements and industry connections'),
(7, 1, 'Bachelor of Commerce (Honors)', 'BCOMH', 'Undergraduate', 3.0, 120, 95000.00, 'HSC with minimum 70%', 'Premium commerce program with international perspective');

-- Link Facilities to Colleges
INSERT INTO college_facilities (college_id, facility_id, details) VALUES
-- St. Xavier's
(1, 1, 'Well-stocked library with over 100,000 books and digital resources'),
(1, 2, 'Modern computer labs with latest software and high-speed internet'),
(1, 3, 'Sports complex with facilities for cricket, basketball, and athletics'),
(1, 5, 'Multiple cafeterias serving diverse cuisines'),
(1, 6, 'Wi-Fi enabled campus'),
(1, 7, 'Large auditorium for events and conferences'),

-- HR College
(2, 1, 'Comprehensive library with commerce and management resources'),
(2, 2, 'Computer labs with trading simulation software'),
(2, 10, 'Dedicated placement cell with 95% placement record'),
(2, 5, 'Cafeteria'),
(2, 6, 'Wi-Fi campus'),

-- VJTI
(6, 1, 'Central library with extensive engineering resources'),
(6, 2, 'State-of-the-art computer labs'),
(6, 11, 'Advanced research laboratories'),
(6, 4, 'Separate hostels for boys and girls'),
(6, 3, 'Sports facilities'),
(6, 10, 'Strong placement cell with top company recruiters'),
(6, 6, 'High-speed Wi-Fi'),

-- NMIMS
(7, 1, 'Business library with international journals and databases'),
(7, 2, 'Computer centers with analytics software'),
(7, 4, 'On-campus hostel facilities'),
(7, 10, 'Excellent placement cell with Fortune 500 companies'),
(7, 8, 'Well-equipped gymnasium'),
(7, 6, 'Campus-wide Wi-Fi');

-- Admission Information
INSERT INTO admission_info (college_id, admission_process, entrance_exam, cutoff_info, important_dates, documents_required) VALUES
(1, 'Merit-based admission through centralized online portal. Selection based on HSC marks and entrance test scores.', 'University entrance exam', 'Previous year cutoff: Commerce - 92%, Science - 88%, Arts - 80%', 'Application starts: June 1st, Admission closes: July 15th', 'HSC marksheet, Transfer certificate, Migration certificate, Aadhar card, Passport photos'),
(2, 'Direct admission based on HSC merit. Online application through college portal.', 'College entrance test for some courses', 'Commerce cutoff: 94%, BMS cutoff: 90%', 'Applications open: June 1st, Merit list: July 10th', 'HSC marksheet, LC, Aadhar, Domicile certificate'),
(6, 'Admission through JEE Main counseling. State quota and All India quota seats available.', 'JEE Main', 'JEE Main cutoff: Computer Engg - 12000 rank, Mechanical - 18000 rank', 'JEE Main: April, Counseling: June-July', 'JEE scorecard, HSC marksheet, Caste certificate (if applicable)'),
(7, 'Entrance exam (NMAT) based admission followed by Group Discussion and Personal Interview', 'NMAT by GMAC', 'NMAT score: 220+ for MBA', 'NMAT registration: July, Exam: October-December, Admissions: January', 'Graduation marksheet, NMAT scorecard, Work experience certificate (if any)');

-- Placement Records
INSERT INTO placements (college_id, academic_year, total_students_placed, placement_percentage, highest_package, average_package, top_recruiters) VALUES
(1, '2024-25', 210, 87.50, 1800000.00, 650000.00, 'Deloitte, KPMG, EY, HDFC Bank, ICICI Bank, TCS, Infosys'),
(2, '2024-25', 165, 91.67, 2200000.00, 750000.00, 'Goldman Sachs, JP Morgan, Axis Bank, Accenture, McKinsey'),
(6, '2024-25', 285, 96.00, 4500000.00, 1250000.00, 'Google, Microsoft, Amazon, Goldman Sachs, Morgan Stanley, Oracle, Cisco'),
(7, '2024-25', 420, 98.00, 5200000.00, 1850000.00, 'McKinsey, BCG, Bain, Deloitte, Amazon, Microsoft, HDFC Bank'),
(8, '2024-25', 240, 92.00, 3800000.00, 1100000.00, 'Microsoft, Adobe, Qualcomm, Morgan Stanley, Deutsche Bank');

-- Sample Reviews
INSERT INTO reviews (college_id, user_id, rating, review_title, review_text, course_studied, batch_year, is_verified, helpful_count, status) VALUES
(1, 2, 5, 'Excellent College with Great Faculty', 'St. Xavier''s has been an amazing experience. The faculty is highly knowledgeable and supportive. The campus culture is vibrant with numerous clubs and activities. The infrastructure is top-notch and the library resources are extensive.', 'B.Com', '2021-2024', TRUE, 24, 'approved'),
(1, 3, 4, 'Good Academic Environment', 'Overall good college with strong emphasis on academics. However, the campus could use some modernization. The peer group is excellent and professors are approachable.', 'B.Sc Computer Science', '2022-2025', TRUE, 15, 'approved'),
(2, 2, 5, 'Best Commerce College in Mumbai', 'HR College lives up to its reputation. The commerce program is comprehensive and the placement opportunities are outstanding. Got placed in a top investment bank with a great package.', 'B.Com', '2020-2023', TRUE, 31, 'approved'),
(6, 3, 5, 'Premier Engineering Institute', 'VJTI is the best choice for engineering in Mumbai. The faculty, labs, and placement support are exceptional. The competitive environment pushes you to excel.', 'B.Tech Computer Engineering', '2021-2025', TRUE, 42, 'approved'),
(7, 4, 4, 'Great MBA Program but Expensive', 'NMIMS offers an excellent MBA program with top-notch faculty and industry exposure. The only downside is the high fee structure. However, the ROI is good considering the placement packages.', 'MBA', '2023-2025', TRUE, 28, 'approved');

-- Save some colleges for users
INSERT INTO saved_colleges (user_id, college_id) VALUES
(2, 1), (2, 2), (2, 6),
(3, 1), (3, 6), (3, 7),
(4, 6), (4, 7), (4, 8);
