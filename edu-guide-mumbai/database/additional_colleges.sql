-- Additional Colleges for Edu Guide Mumbai

USE test;

-- Insert more colleges
INSERT INTO colleges (college_name, college_code, address, city, state, pincode, phone, email, website, established_year, college_type, affiliation, description, average_rating, total_reviews, status) VALUES
('IIT Bombay', 'IITB001', 'Powai', 'Mumbai', 'Maharashtra', '400076', '022-25722545', 'webmaster@iitb.ac.in', 'www.iitb.ac.in', 1958, 'Government', 'Autonomous', 'Premier engineering and technology institute, consistently ranked among top institutions in India.', 4.8, 250, 'active'),
('SIES College of Arts, Science and Commerce', 'SIES001', 'Sion West', 'Mumbai', 'Maharashtra', '400022', '022-24072714', 'principal@sies.edu.in', 'www.sies.edu.in', 1932, 'Aided', 'University of Mumbai', 'Well-established college offering programs in Arts, Science, and Commerce.', 4.1, 85, 'active'),
('Sophia College for Women', 'SOPHIA001', 'Bhulabhai Desai Road', 'Mumbai', 'Maharashtra', '400026', '022-23515984', 'principal@sophiacollege.edu.in', 'www.sophiacollege.edu.in', 1941, 'Aided', 'University of Mumbai', 'Premier women\'s college known for academic excellence and holistic development.', 4.4, 105, 'active'),
('Jai Hind College', 'JHC002', 'A Road, Churchgate', 'Mumbai', 'Maharashtra', '400020', '022-22821897', 'info@jaihindcollege.com', 'www.jaihindcollege.com', 1948, 'Autonomous', 'University of Mumbai', 'Leading college offering diverse programs with focus on overall personality development.', 4.2, 92, 'active'),
('Poddar College of Commerce and Economics', 'PODDAR001', 'Naigaon Cross Road, Dadar', 'Mumbai', 'Maharashtra', '400014', '022-24162633', 'principal@poddar.org', 'www.poddar.org', 1941, 'Aided', 'University of Mumbai', 'Reputed commerce college with strong academic track record.', 4.0, 72, 'active'),
('R.A. Podar College of Commerce and Economics', 'RAPODAR001', 'Matunga', 'Mumbai', 'Maharashtra', '400019', '022-24157000', 'principal@podarcollege.com', 'www.podarcollege.com', 1941, 'Aided', 'University of Mumbai', 'Well-known commerce college with excellent faculty and infrastructure.', 4.1, 78, 'active'),
('Kishinchand Chellaram College', 'KC002', 'Dinshaw Wachha Road, Churchgate', 'Mumbai', 'Maharashtra', '400020', '022-22820092', 'office@kccollege.edu.in', 'www.kccollege.edu.in', 1954, 'Aided', 'University of Mumbai', 'Multi-stream college offering quality education in various disciplines.', 4.1, 80, 'active'),
('D.G. Ruparel College', 'RUPAREL001', 'Matunga', 'Mumbai', 'Maharashtra', '400016', '022-24157281', 'principal@ruparel.edu', 'www.ruparel.edu', 1954, 'Aided', 'University of Mumbai', 'Established college known for science and commerce programs.', 4.0, 68, 'active'),
('Sydenham College of Commerce and Economics', 'SYDENHAM001', 'Churchgate', 'Mumbai', 'Maharashtra', '400020', '022-22620092', 'principal@sydenham.ac.in', 'www.sydenham.ac.in', 1913, 'Autonomous', 'University of Mumbai', 'One of India\'s oldest commerce colleges with rich heritage and academic excellence.', 4.3, 110, 'active'),
('Kelkar Education Trust\'s V.G. Vaze College', 'VAZE001', 'Mithagar Road, Mulund East', 'Mumbai', 'Maharashtra', '400081', '022-25631325', 'principal@vaze.ac.in', 'www.vaze.ac.in', 1984, 'Aided', 'University of Mumbai', 'Multi-faculty college offering diverse programs with modern facilities.', 4.0, 65, 'active'),
('Thakur College of Engineering and Technology', 'TCET001', 'Kandivali East', 'Mumbai', 'Maharashtra', '400101', '022-28764610', 'principal@tcet.in', 'www.tcet.in', 2001, 'Private', 'University of Mumbai', 'Modern engineering college with industry-oriented curriculum.', 4.2, 88, 'active'),
('Sardar Patel Institute of Technology', 'SPIT001', 'Andheri West', 'Mumbai', 'Maharashtra', '400058', '022-26707440', 'principal@spit.ac.in', 'www.spit.ac.in', 1962, 'Autonomous', 'University of Mumbai', 'Premier engineering institute with excellent placement record.', 4.4, 125, 'active'),
('Dwarkadas J. Sanghvi College of Engineering', 'DJSCE001', 'Vile Parle West', 'Mumbai', 'Maharashtra', '400056', '022-26282000', 'principal@djsce.ac.in', 'www.djsce.ac.in', 1994, 'Autonomous', 'University of Mumbai', 'Top engineering college known for quality education and placements.', 4.3, 115, 'active'),
('Thadomal Shahani Engineering College', 'TSEC001', 'Bandra West', 'Mumbai', 'Maharashtra', '400050', '022-26422463', 'principal@tsec.edu', 'www.tsec.edu', 1983, 'Autonomous', 'University of Mumbai', 'Well-established engineering college with strong industry connections.', 4.2, 95, 'active'),
('Bharati Vidyapeeth College of Engineering', 'BVCOE001', 'Kharghar, Navi Mumbai', 'Navi Mumbai', 'Maharashtra', '410210', '022-27740104', 'principal@bharatividyapeeth.edu', 'www.bharatividyapeeth.edu', 1996, 'Private', 'University of Mumbai', 'Engineering college with modern infrastructure and experienced faculty.', 4.0, 70, 'active'),
('Atharva College of Engineering', 'ACE001', 'Malad West', 'Mumbai', 'Maharashtra', '400095', '022-28801811', 'principal@atharvacoe.ac.in', 'www.atharvacoe.ac.in', 1999, 'Private', 'University of Mumbai', 'Growing engineering college with focus on practical learning.', 3.9, 62, 'active'),
('Vivekanand Education Society\'s Institute of Technology', 'VESIT001', 'Chembur', 'Mumbai', 'Maharashtra', '400074', '022-25563428', 'principal@vesit.ves.ac.in', 'www.vesit.ves.ac.in', 1984, 'Autonomous', 'University of Mumbai', 'Reputed engineering institute with strong academic programs.', 4.3, 108, 'active'),
('Fr. Conceicao Rodrigues College of Engineering', 'CRCE001', 'Bandra West', 'Mumbai', 'Maharashtra', '400050', '022-26510068', 'principal@fragnel.edu.in', 'www.fragnel.edu.in', 1984, 'Aided', 'University of Mumbai', 'Engineering college known for quality education and discipline.', 4.1, 82, 'active'),
('Pillai College of Engineering', 'PCE001', 'New Panvel', 'Navi Mumbai', 'Maharashtra', '410206', '022-27481247', 'principal@pce.ac.in', 'www.pce.ac.in', 1999, 'Private', 'University of Mumbai', 'Modern engineering college with good infrastructure.', 4.0, 75, 'active'),
('Vidyalankar Institute of Technology', 'VIT001', 'Wadala East', 'Mumbai', 'Maharashtra', '400037', '022-24160117', 'principal@vit.edu.in', 'www.vit.edu.in', 1997, 'Private', 'University of Mumbai', 'Engineering institute with focus on innovation and entrepreneurship.', 3.9, 68, 'active'),
('Rizvi College of Engineering', 'RIZVI001', 'Bandra West', 'Mumbai', 'Maharashtra', '400050', '022-26053506', 'principal@rizvi.edu.in', 'www.rizvi.edu.in', 1998, 'Private', 'University of Mumbai', 'Engineering college with diverse programs and modern facilities.', 3.8, 58, 'active'),
('Shree L.R. Tiwari College of Engineering', 'LRTCE001', 'Mira Road', 'Thane', 'Maharashtra', '401107', '022-28121263', 'principal@lrtce.com', 'www.lrtce.com', 2007, 'Private', 'University of Mumbai', 'Engineering college serving the extended Mumbai region.', 3.7, 52, 'active'),
('Elphinstone College', 'ELPHIN001', 'Fort', 'Mumbai', 'Maharashtra', '400032', '022-22661326', 'principal@elphinstone.ac.in', 'www.elphinstone.ac.in', 1856, 'Government', 'University of Mumbai', 'One of India\'s oldest colleges with rich heritage in arts and science.', 4.2, 95, 'active'),
('Ramnarain Ruia Autonomous College', 'RUIA002', 'L.N. Road, Matunga', 'Mumbai', 'Maharashtra', '400019', '022-24157000', 'info@ruiacollege.edu', 'www.ruiacollege.edu', 1937, 'Autonomous', 'University of Mumbai', 'Premier science college with excellent research facilities.', 4.3, 102, 'active'),
('Sathaye College', 'SATHAYE001', 'Vile Parle East', 'Mumbai', 'Maharashtra', '400057', '022-26707700', 'principal@sathaye.org', 'www.sathaye.org', 1971, 'Aided', 'University of Mumbai', 'Multi-stream college with good academic reputation.', 4.0, 70, 'active'),
('Mulund College of Commerce', 'MCC001', 'Mulund West', 'Mumbai', 'Maharashtra', '400080', '022-25631291', 'principal@mulundcollege.org', 'www.mulundcollege.org', 1985, 'Aided', 'University of Mumbai', 'Commerce college serving the suburban Mumbai region.', 3.9, 58, 'active'),
('Guru Nanak College of Arts, Science and Commerce', 'GNC001', 'Matunga', 'Mumbai', 'Maharashtra', '400019', '022-24157000', 'principal@gurunanakcollege.edu.in', 'www.gurunanakcollege.edu.in', 1960, 'Aided', 'University of Mumbai', 'Established college offering diverse programs.', 4.0, 65, 'active'),
('Smt. M.M.P. Shah Women\'s College of Arts and Commerce', 'MMPSHAH001', 'Matunga', 'Mumbai', 'Maharashtra', '400019', '022-24157000', 'principal@mmpshah.org', 'www.mmpshah.org', 1960, 'Aided', 'University of Mumbai', 'Women\'s college with focus on holistic education.', 3.9, 60, 'active'),
('Lala Lajpatrai College of Commerce and Economics', 'LLR001', 'Mahalaxmi', 'Mumbai', 'Maharashtra', '400034', '022-23524084', 'principal@llrcollege.edu.in', 'www.llrcollege.edu.in', 1952, 'Aided', 'University of Mumbai', 'Commerce college with strong academic tradition.', 4.0, 68, 'active'),
('Narsee Monjee College of Commerce and Economics', 'NMCCE001', 'Vile Parle West', 'Mumbai', 'Maharashtra', '400056', '022-26185486', 'principal@nmcollege.in', 'www.nmcollege.in', 1964, 'Autonomous', 'University of Mumbai', 'Premier commerce college with excellent placement record.', 4.3, 98, 'active');

-- Link some colleges to streams
INSERT INTO college_streams (college_id, stream_id) VALUES
-- IIT Bombay (Engineering, IT)
(11, 5), (11, 6),
-- SIES (Arts, Science, Commerce)
(12, 1), (12, 2), (12, 3),
-- Sophia (Arts, Science, Commerce)
(13, 1), (13, 2), (13, 3),
-- Sydenham (Commerce)
(19, 1),
-- SPIT (Engineering, IT)
(22, 5), (22, 6),
-- DJSCE (Engineering, IT)
(23, 5), (23, 6),
-- VESIT (Engineering, IT)
(27, 5), (27, 6),
-- Elphinstone (Arts, Science)
(33, 2), (33, 3),
-- NMCCE (Commerce)
(40, 1);

-- Add some sample courses for new colleges
INSERT INTO courses (college_id, stream_id, course_name, course_code, degree_type, duration_years, total_seats, fees_per_year, eligibility, description) VALUES
-- IIT Bombay
(11, 5, 'Bachelor of Technology in Computer Science', 'BTECHCS', 'Undergraduate', 4.0, 100, 220000.00, 'JEE Advanced with top rank', 'Premier computer science program with world-class faculty and research'),
(11, 5, 'Bachelor of Technology in Electrical Engineering', 'BTECHEE', 'Undergraduate', 4.0, 80, 220000.00, 'JEE Advanced with top rank', 'Comprehensive electrical engineering program'),
-- Sophia College
(13, 1, 'Bachelor of Commerce', 'BCOM', 'Undergraduate', 3.0, 120, 42000.00, 'HSC with minimum 60%', 'Commerce program for women with focus on leadership'),
-- Sydenham
(19, 1, 'Bachelor of Commerce', 'BCOM', 'Undergraduate', 3.0, 200, 46000.00, 'HSC with minimum 65%', 'Premier commerce education with heritage'),
(19, 1, 'Bachelor of Management Studies', 'BMS', 'Undergraduate', 3.0, 100, 50000.00, 'HSC with minimum 60%', 'Management program with industry focus');

