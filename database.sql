-- RoomSync AI - Database Schema & Mock Data Seed Script
-- Import this SQL script into your MySQL database server (e.g. via phpMyAdmin or command-line).

CREATE DATABASE IF NOT EXISTS roomsync_db;
USE roomsync_db;

-- 1. Table structure for table `students`
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `branch` VARCHAR(100) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table structure for table `preferences`
CREATE TABLE IF NOT EXISTS `preferences` (
  `pref_id` INT AUTO_INCREMENT NOT NULL,
  `student_id` VARCHAR(50) NOT NULL,
  `sleep_schedule` VARCHAR(50) NOT NULL,
  `study_style` VARCHAR(50) NOT NULL,
  `cleanliness` VARCHAR(50) NOT NULL,
  `social_pref` VARCHAR(50) NOT NULL,
  `room_environment` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`pref_id`),
  CONSTRAINT `fk_pref_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table structure for table `hobbies`
CREATE TABLE IF NOT EXISTS `hobbies` (
  `hobby_id` INT AUTO_INCREMENT NOT NULL,
  `student_id` VARCHAR(50) NOT NULL,
  `hobby_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`hobby_id`),
  CONSTRAINT `fk_hobby_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table structure for table `matches`
CREATE TABLE IF NOT EXISTS `matches` (
  `match_id` INT AUTO_INCREMENT NOT NULL,
  `student_a_id` VARCHAR(50) NOT NULL,
  `student_b_id` VARCHAR(50) NOT NULL,
  `compatibility_score` INT NOT NULL,
  `match_date` DATETIME NOT NULL,
  PRIMARY KEY (`match_id`),
  CONSTRAINT `fk_match_student_a` FOREIGN KEY (`student_a_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_student_b` FOREIGN KEY (`student_b_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- SEED DATA: Inserting 10 Mock Students
-- ==========================================

-- Empty the tables first if running this multiple times
DELETE FROM `matches`;
DELETE FROM `hobbies`;
DELETE FROM `preferences`;
DELETE FROM `students`;

INSERT INTO `students` (`student_id`, `name`, `gender`, `branch`, `year`, `email`) VALUES
('S202601', 'Aarav Sharma', 'Male', 'Computer Science', '2nd Year', 'aarav.sharma@hostel.edu'),
('S202602', 'Kavita Verma', 'Female', 'Electronics', '3rd Year', 'kavita.verma@hostel.edu'),
('S202603', 'Rahul Nair', 'Male', 'Mechanical', '2nd Year', 'rahul.nair@hostel.edu'),
('S202604', 'Meera Pillai', 'Female', 'Biotech', '1st Year', 'meera.pillai@hostel.edu'),
('S202605', 'Siddharth Patel', 'Male', 'Civil Engineering', '4th Year', 'siddharth.patel@hostel.edu'),
('S202606', 'Anjali Das', 'Female', 'Information Tech', '3rd Year', 'anjali.das@hostel.edu'),
('S202607', 'Rohan Gupta', 'Male', 'Computer Science', '2nd Year', 'rohan.gupta@hostel.edu'),
('S202608', 'Neha Roy', 'Female', 'Electrical', '1st Year', 'neha.roy@hostel.edu'),
('S202609', 'Vikram Singh', 'Male', 'Chemical', '3rd Year', 'vikram.singh@hostel.edu'),
('S202610', 'Tanvi Sen', 'Female', 'Architecture', '2nd Year', 'tanvi.sen@hostel.edu');

INSERT INTO `preferences` (`pref_id`, `student_id`, `sleep_schedule`, `study_style`, `cleanliness`, `social_pref`, `room_environment`) VALUES
(1, 'S202601', 'Late Sleeper', 'Flexible', 'Average', 'Extrovert', 'Social'),
(2, 'S202602', 'Early Sleeper', 'Silent Study', 'Very Clean', 'Introvert', 'Quiet'),
(3, 'S202603', 'Late Sleeper', 'Group Study', 'Relaxed', 'Extrovert', 'Social'),
(4, 'S202604', 'Early Sleeper', 'Silent Study', 'Very Clean', 'Introvert', 'Quiet'),
(5, 'S202605', 'Early Sleeper', 'Flexible', 'Average', 'Balanced', 'Moderate'),
(6, 'S202606', 'Late Sleeper', 'Group Study', 'Relaxed', 'Extrovert', 'Social'),
(7, 'S202607', 'Early Sleeper', 'Silent Study', 'Very Clean', 'Balanced', 'Quiet'),
(8, 'S202608', 'Late Sleeper', 'Flexible', 'Average', 'Balanced', 'Moderate'),
(9, 'S202609', 'Late Sleeper', 'Group Study', 'Average', 'Extrovert', 'Social'),
(10, 'S202610', 'Early Sleeper', 'Flexible', 'Average', 'Balanced', 'Moderate');

INSERT INTO `hobbies` (`hobby_id`, `student_id`, `hobby_name`) VALUES
(1, 'S202601', 'Gaming'),
(2, 'S202601', 'Coding'),
(3, 'S202601', 'Music'),
(4, 'S202602', 'Reading'),
(5, 'S202602', 'Photography'),
(6, 'S202602', 'Fitness'),
(7, 'S202603', 'Gaming'),
(8, 'S202603', 'Sports'),
(9, 'S202603', 'Movies'),
(10, 'S202604', 'Reading'),
(11, 'S202604', 'Coding'),
(12, 'S202604', 'Movies'),
(13, 'S202605', 'Sports'),
(14, 'S202605', 'Movies'),
(15, 'S202605', 'Photography'),
(16, 'S202606', 'Gaming'),
(17, 'S202606', 'Music'),
(18, 'S202606', 'Movies'),
(19, 'S202607', 'Coding'),
(20, 'S202607', 'Reading'),
(21, 'S202607', 'Fitness'),
(22, 'S202608', 'Music'),
(23, 'S202608', 'Photography'),
(24, 'S202608', 'Fitness'),
(25, 'S202609', 'Gaming'),
(26, 'S202609', 'Sports'),
(27, 'S202609', 'Music'),
(28, 'S202610', 'Reading'),
(29, 'S202610', 'Music'),
(30, 'S202610', 'Photography');

INSERT INTO `matches` (`match_id`, `student_a_id`, `student_b_id`, `compatibility_score`, `match_date`) VALUES
(1, 'S202601', 'S202603', 91, NOW()),
(2, 'S202602', 'S202604', 97, NOW()),
(3, 'S202605', 'S202607', 84, NOW()),
(4, 'S202606', 'S202608', 82, NOW()),
(5, 'S202609', 'S202601', 88, NOW());
