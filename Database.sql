-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: nhom4_baitap
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_requests`
--

DROP TABLE IF EXISTS `account_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hr_id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('employee','manager','accountant') COLLATE utf8mb4_unicode_ci DEFAULT 'employee',
  `department_id` int DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_id` (`hr_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `account_requests_ibfk_187` FOREIGN KEY (`hr_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `account_requests_ibfk_188` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_requests`
--

LOCK TABLES `account_requests` WRITE;
/*!40000 ALTER TABLE `account_requests` DISABLE KEYS */;
INSERT INTO `account_requests` VALUES (1,2,'newdev@example.com','Nguyễn Tấn Phát','employee',2,'approved','2026-05-15 10:00:00','2026-05-16 09:00:00'),(2,2,'newmarketing@example.com','Trần Thị Nhung','employee',5,'pending','2026-06-10 14:00:00','2026-06-10 14:00:00'),(3,2,'newmanager@example.com','Phạm Văn Kiên','manager',2,'rejected','2026-05-01 09:00:00','2026-05-05 11:00:00');
/*!40000 ALTER TABLE `account_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci,
  `ip` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,4,'USER_LOGIN','Đăng nhập thành công','127.0.0.1','Mozilla/5.0 Chrome/125.0',1,'2026-06-18 08:01:00'),(2,4,'PAYROLL_CALCULATE','Tính lương tháng 2026-06 cho 5 nhân viên','127.0.0.1','Mozilla/5.0 Chrome/125.0',0,'2026-06-18 09:30:00'),(3,3,'LEAVE_APPROVED','Duyệt đơn nghỉ phép của Lê Văn Bình','127.0.0.1','Mozilla/5.0 Chrome/125.0',1,'2026-05-30 09:00:00'),(4,4,'ADVANCE_APPROVED','Duyệt tạm ứng ADV-2026-0003','127.0.0.1','Mozilla/5.0 Chrome/125.0',0,'2026-06-12 14:00:00'),(5,3,'USER_LOGIN','Đăng nhập thành công','127.0.0.1','Mozilla/5.0 Safari/17.0',1,'2026-06-18 08:05:00'),(6,1,'login','Đăng nhập tài khoản admin@example.com','::ffff:127.0.0.1','node',0,'2026-06-22 11:52:38'),(7,2,'login','Đăng nhập tài khoản hr@example.com','::ffff:127.0.0.1','node',0,'2026-06-22 11:52:38'),(8,3,'login','Đăng nhập tài khoản manager@example.com','::ffff:127.0.0.1','node',0,'2026-06-22 11:52:38'),(9,4,'login','Đăng nhập tài khoản accountant@example.com','::ffff:127.0.0.1','node',0,'2026-06-22 11:52:38'),(10,5,'login','Đăng nhập tài khoản user@example.com','::ffff:127.0.0.1','node',0,'2026-06-22 11:52:38'),(11,6,'login','Đăng nhập tài khoản employee1@example.com','::ffff:127.0.0.1','node',0,'2026-06-22 11:52:38'),(12,5,'login','Đăng nhập tài khoản user@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 11:53:54'),(13,1,'login','Đăng nhập tài khoản admin@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 11:55:01'),(14,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 11:56:56'),(15,1,'login','Đăng nhập tài khoản admin@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 11:58:36'),(16,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 11:59:17'),(17,5,'login','Đăng nhập tài khoản user@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 12:09:32'),(18,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-22 12:10:36'),(19,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-23 03:41:03'),(20,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:42:09'),(21,2,'move_candidate_stage','Đặng Quốc Hùng: new → iv1','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:44:04'),(22,2,'create_candidate','Thêm ứng viên Nguyễn Bảo Lợi - Backend Developer','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:46:53'),(23,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:50:00'),(24,2,'analyze_cv','Phân tích CV Nguyễn Bảo Lợi — Match Score: 50.0/100','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:53:00'),(25,2,'delete_candidate','Xoá ứng viên Nguyễn Bảo Lợi','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:53:37'),(26,2,'create_candidate','Thêm ứng viên Nguyễn Bảo lợi - Backend Developer','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:55:59'),(27,2,'analyze_cv','Phân tích CV Nguyễn Bảo lợi — Match Score: 55.5/100','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 03:56:24'),(28,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-23 09:27:46'),(29,2,'move_candidate_stage','Nguyễn Bảo lợi: new → screening','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-23 09:28:08'),(30,1,'login','Đăng nhập tài khoản admin@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 10:26:51'),(31,23,'login','Đăng nhập tài khoản tranvanc@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 10:27:40'),(32,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 10:28:14'),(33,2,'Chốt bảng công','Khóa dữ liệu chấm công tháng 2026-06',NULL,NULL,0,'2026-06-23 10:28:36'),(34,1,'login','Đăng nhập tài khoản admin@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 10:28:53'),(35,1,'admin_reset_password','Admin đặt lại mật khẩu cho tài khoản tranvanc@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 10:29:48'),(36,2,'login','Đăng nhập tài khoản hr@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',0,'2026-06-23 10:33:52'),(37,1,'login','Đăng nhập tài khoản admin@example.com','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36',0,'2026-06-25 08:15:41');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advance_requests`
--

DROP TABLE IF EXISTS `advance_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advance_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  `amount` bigint NOT NULL,
  `monthly_salary` bigint DEFAULT NULL,
  `yearly_advanced` bigint NOT NULL DEFAULT '0',
  `yearly_limit` bigint DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `urgent` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','approved','rejected','deducting','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `deduct_method` enum('full','split') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deduct_months` int DEFAULT NULL,
  `disburse_date` date DEFAULT NULL,
  `reviewed_by` int DEFAULT NULL,
  `reject_reason` text COLLATE utf8mb4_unicode_ci,
  `deducted_so_far` bigint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `code_31` (`code`),
  UNIQUE KEY `code_32` (`code`),
  UNIQUE KEY `code_33` (`code`),
  UNIQUE KEY `code_34` (`code`),
  KEY `user_id` (`user_id`),
  KEY `reviewed_by` (`reviewed_by`),
  CONSTRAINT `advance_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `advance_requests_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advance_requests`
--

LOCK TABLES `advance_requests` WRITE;
/*!40000 ALTER TABLE `advance_requests` DISABLE KEYS */;
INSERT INTO `advance_requests` VALUES (1,'ADV-2026-0001',6,5000000,16000000,5000000,45000000,'Chi phí sửa chữa xe đột xuất',1,'completed','full',1,'2026-04-15',4,NULL,5000000,'2026-04-10 09:00:00','2026-04-20 10:00:00'),(2,'ADV-2026-0002',7,10000000,15000000,10000000,45000000,'Đặt cọc thuê nhà mới',0,'deducting','split',2,'2026-05-01',4,NULL,5000000,'2026-04-25 14:00:00','2026-05-05 09:00:00'),(3,'ADV-2026-0003',8,3000000,8000000,3000000,24000000,'Chi phí học tiếng Anh',0,'approved','full',1,'2026-06-20',4,NULL,0,'2026-06-10 10:00:00','2026-06-12 14:00:00'),(4,'ADV-2026-0004',10,8000000,14000000,0,42000000,'Chi phí cưới hỏi',1,'pending',NULL,NULL,NULL,NULL,NULL,0,'2026-06-18 16:00:00','2026-06-18 16:00:00');
/*!40000 ALTER TABLE `advance_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_locks`
--

DROP TABLE IF EXISTS `attendance_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_locks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('draft','locked') COLLATE utf8mb4_unicode_ci DEFAULT 'locked',
  `locked_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `month` (`month`),
  UNIQUE KEY `month_2` (`month`),
  UNIQUE KEY `month_3` (`month`),
  UNIQUE KEY `month_4` (`month`),
  UNIQUE KEY `month_5` (`month`),
  UNIQUE KEY `month_6` (`month`),
  UNIQUE KEY `month_7` (`month`),
  UNIQUE KEY `month_8` (`month`),
  UNIQUE KEY `month_9` (`month`),
  UNIQUE KEY `month_10` (`month`),
  UNIQUE KEY `month_11` (`month`),
  UNIQUE KEY `month_12` (`month`),
  UNIQUE KEY `month_13` (`month`),
  UNIQUE KEY `month_14` (`month`),
  UNIQUE KEY `month_15` (`month`),
  UNIQUE KEY `month_16` (`month`),
  UNIQUE KEY `month_17` (`month`),
  UNIQUE KEY `month_18` (`month`),
  UNIQUE KEY `month_19` (`month`),
  UNIQUE KEY `month_20` (`month`),
  UNIQUE KEY `month_21` (`month`),
  UNIQUE KEY `month_22` (`month`),
  UNIQUE KEY `month_23` (`month`),
  UNIQUE KEY `month_24` (`month`),
  UNIQUE KEY `month_25` (`month`),
  UNIQUE KEY `month_26` (`month`),
  UNIQUE KEY `month_27` (`month`),
  UNIQUE KEY `month_28` (`month`),
  UNIQUE KEY `month_29` (`month`),
  UNIQUE KEY `month_30` (`month`),
  UNIQUE KEY `month_31` (`month`),
  UNIQUE KEY `month_32` (`month`),
  UNIQUE KEY `month_33` (`month`),
  UNIQUE KEY `month_34` (`month`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_locks`
--

LOCK TABLES `attendance_locks` WRITE;
/*!40000 ALTER TABLE `attendance_locks` DISABLE KEYS */;
INSERT INTO `attendance_locks` VALUES (4,'2026-06','locked',2,'2026-06-23 10:28:36','2026-06-23 10:28:36');
/*!40000 ALTER TABLE `attendance_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Late','Absent','OnLeave') COLLATE utf8mb4_unicode_ci DEFAULT 'Present',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `work_hours` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (1,6,'2026-06-02','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-02 08:01:00','2026-06-02 17:30:00',8.5),(2,6,'2026-06-03','Late','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-03 09:15:00','2026-06-03 18:00:00',7.75),(3,6,'2026-06-04','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-04 07:58:00','2026-06-04 17:00:00',9),(4,6,'2026-06-05','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-05 08:05:00','2026-06-05 17:15:00',8.2),(5,7,'2026-06-02','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-02 08:00:00','2026-06-02 17:00:00',8),(6,7,'2026-06-03','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-03 08:10:00','2026-06-03 17:10:00',8),(7,7,'2026-06-04','Absent','2026-06-22 11:52:37','2026-06-22 11:52:37',NULL,NULL,0),(8,7,'2026-06-05','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-05 08:00:00','2026-06-05 17:00:00',8),(9,8,'2026-06-02','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-02 08:30:00','2026-06-02 17:30:00',8),(10,8,'2026-06-03','Late','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-03 09:30:00','2026-06-03 18:30:00',8),(11,8,'2026-06-04','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-04 08:00:00','2026-06-04 17:00:00',8),(12,8,'2026-06-05','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-05 08:05:00','2026-06-05 17:05:00',8),(13,9,'2026-06-02','OnLeave','2026-06-22 11:52:37','2026-06-22 11:52:37',NULL,NULL,0),(14,9,'2026-06-03','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-03 08:00:00','2026-06-03 17:00:00',8),(15,9,'2026-06-04','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-04 07:55:00','2026-06-04 17:00:00',8.1),(16,9,'2026-06-05','Late','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-05 09:00:00','2026-06-05 18:00:00',8),(17,10,'2026-06-02','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-02 08:00:00','2026-06-02 17:00:00',8),(18,10,'2026-06-03','Absent','2026-06-22 11:52:37','2026-06-22 11:52:37',NULL,NULL,0),(19,10,'2026-06-04','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-04 08:00:00','2026-06-04 17:00:00',8),(20,10,'2026-06-05','Present','2026-06-22 11:52:37','2026-06-22 11:52:37','2026-06-05 08:10:00','2026-06-05 17:10:00',8);
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skills` text COLLATE utf8mb4_unicode_ci,
  `experience_years` int DEFAULT '0',
  `expected_salary` bigint DEFAULT NULL,
  `source` enum('LinkedIn','TopCV','Referral','Direct','Other') COLLATE utf8mb4_unicode_ci DEFAULT 'Other',
  `current_company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `stage` enum('new','screening','iv1','iv2','offer','hired','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `match_score` float DEFAULT NULL,
  `onboard_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `interview_date` datetime DEFAULT NULL,
  `interview_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interviewer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interview_note` text COLLATE utf8mb4_unicode_ci,
  `ai_summary` text COLLATE utf8mb4_unicode_ci,
  `ai_reasoning` text COLLATE utf8mb4_unicode_ci,
  `cv_file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Trần Anh Khoa','anhkhoa@gmail.com','0912345671','Frontend Developer','[\"React\",\"TypeScript\",\"TailwindCSS\"]',3,20000000,'LinkedIn','FPT Software','Ứng viên tiềm năng','screening',4.2,NULL,NULL,'2026-06-22 11:52:38','2026-06-22 11:52:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Lý Thị Hoa','lythihoa@gmail.com','0912345672','Backend Developer','[\"Node.js\",\"MySQL\",\"Docker\"]',4,22000000,'TopCV','Tiki','Có kinh nghiệm tốt','iv1',4.5,NULL,NULL,'2026-06-22 11:52:38','2026-06-22 11:52:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Phan Minh Tuấn','minhtuan@gmail.com','0912345673','UI/UX Designer','[\"Figma\",\"Adobe XD\",\"Sketch\"]',2,16000000,'Referral','Freelancer',NULL,'iv2',3.8,NULL,NULL,'2026-06-22 11:52:38','2026-06-22 11:52:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Bùi Thị Ngọc','buitngoc@gmail.com','0912345674','HR Officer','[\"Tuyển dụng\",\"HRIS\",\"Excel\"]',1,12000000,'Direct','Mới ra trường','Sinh viên mới ra trường','offer',3.5,NULL,NULL,'2026-06-22 11:52:38','2026-06-22 11:52:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'Đặng Quốc Hùng','quochung@gmail.com','0912345675','Marketing Executive','[\"SEO\",\"Google Ads\",\"Content\"]',5,18000000,'LinkedIn','VinGroup','Senior candidate','iv1',4,NULL,NULL,'2026-06-22 11:52:38','2026-06-23 03:44:04',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Nguyễn Bảo lợi','tiemnet.coaching.y3@gmail.com','0941899554','Backend Developer','[\"React\",\"TypeScripts\",\"Java\",\"Spring Boot\",\"Node.js\",\"Express\",\"Python\",\"MySQL\",\"SQL Server\",\"VS Code\",\"Git\",\"GitHub\",\"Phân tích yêu cầu\",\"Thiết kế lược đồ cơ sở dữ liệu\",\"Triển khai kiến trúc backend\",\"Kiểm thử\",\"Code review\"]',1,20000000,'TopCV',NULL,NULL,'screening',55.5,NULL,2,'2026-06-23 03:55:59','2026-06-23 09:28:08',NULL,NULL,NULL,NULL,'Ứng viên là một sinh viên có nền tảng vững chắc về phát triển backend với Java (Spring Boot), Node.js, Python và kinh nghiệm làm việc nhóm, quản lý dự án học thuật. Tuy nhiên, ứng viên thiếu các kỹ năng React và TypeScript được kỳ vọng cho vị trí Backend Developer này.','Ứng viên sở hữu kiến thức chuyên sâu về Java (Spring Boot), Node.js (Express), Python và cơ sở dữ liệu (MySQL, SQL Server), cùng kinh nghiệm thực tế trong thiết kế kiến trúc backend, quản lý phiên bản (Git/GitHub) và code review. Điểm yếu chính là thiếu kinh nghiệm với React và TypeScript, hai kỹ năng được kỳ vọng cho vị trí. Mặc dù ứng viên có tiềm năng lớn và khả năng học hỏi nhanh (ứng dụng AI vào lập trình), sự thiếu hụt các kỹ năng cụ thể có thể đòi hỏi đào tạo thêm hoặc cân nhắc nếu mức độ yêu cầu về các kỹ năng này là linh hoạt.','/uploads/cv/cv_1782186963677_fe31iq.pdf');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `contract_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Chính thức',
  `basic_salary` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','expired','terminated') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by_hr_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `contract_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Full-time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_number` (`contract_number`),
  UNIQUE KEY `contract_number_2` (`contract_number`),
  UNIQUE KEY `contract_number_3` (`contract_number`),
  UNIQUE KEY `contract_number_4` (`contract_number`),
  UNIQUE KEY `contract_number_5` (`contract_number`),
  UNIQUE KEY `contract_number_6` (`contract_number`),
  UNIQUE KEY `contract_number_7` (`contract_number`),
  UNIQUE KEY `contract_number_8` (`contract_number`),
  UNIQUE KEY `contract_number_9` (`contract_number`),
  UNIQUE KEY `contract_number_10` (`contract_number`),
  UNIQUE KEY `contract_number_11` (`contract_number`),
  UNIQUE KEY `contract_number_12` (`contract_number`),
  UNIQUE KEY `contract_number_13` (`contract_number`),
  UNIQUE KEY `contract_number_14` (`contract_number`),
  UNIQUE KEY `contract_number_15` (`contract_number`),
  UNIQUE KEY `contract_number_16` (`contract_number`),
  UNIQUE KEY `contract_number_17` (`contract_number`),
  UNIQUE KEY `contract_number_18` (`contract_number`),
  UNIQUE KEY `contract_number_19` (`contract_number`),
  UNIQUE KEY `contract_number_20` (`contract_number`),
  UNIQUE KEY `contract_number_21` (`contract_number`),
  UNIQUE KEY `contract_number_22` (`contract_number`),
  UNIQUE KEY `contract_number_23` (`contract_number`),
  UNIQUE KEY `contract_number_24` (`contract_number`),
  UNIQUE KEY `contract_number_25` (`contract_number`),
  UNIQUE KEY `contract_number_26` (`contract_number`),
  UNIQUE KEY `contract_number_27` (`contract_number`),
  UNIQUE KEY `contract_number_28` (`contract_number`),
  UNIQUE KEY `contract_number_29` (`contract_number`),
  UNIQUE KEY `contract_number_30` (`contract_number`),
  UNIQUE KEY `contract_number_31` (`contract_number`),
  UNIQUE KEY `contract_number_32` (`contract_number`),
  UNIQUE KEY `contract_number_33` (`contract_number`),
  UNIQUE KEY `contract_number_34` (`contract_number`),
  UNIQUE KEY `contract_number_35` (`contract_number`),
  KEY `user_id` (`user_id`),
  KEY `created_by_hr_id` (`created_by_hr_id`),
  CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`created_by_hr_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES (1,2,'Chính thức',18000000,'2024-01-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-001','Full-time'),(2,3,'Chính thức',25000000,'2024-01-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-002','Full-time'),(3,4,'Chính thức',20000000,'2024-01-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-003','Full-time'),(4,5,'Chính thức',15000000,'2024-01-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-004','Full-time'),(8,6,'Chính thức',16000000,'2024-03-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-005','Full-time'),(9,7,'Chính thức',15000000,'2024-06-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-006','Full-time'),(10,8,'Thời vụ',8000000,'2025-01-01','2026-06-30','active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2025-007','Intern'),(11,9,'Thời vụ',8000000,'2025-03-01','2026-03-01','expired',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2025-008','Intern'),(12,10,'Chính thức',14000000,'2024-09-01',NULL,'active',NULL,'2026-06-22 11:52:37','2026-06-22 11:52:37','CT-2024-009','Full-time');
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `name_31` (`name`),
  UNIQUE KEY `name_32` (`name`),
  UNIQUE KEY `name_33` (`name`),
  UNIQUE KEY `name_34` (`name`),
  UNIQUE KEY `name_35` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Ban Giám Đốc','Lãnh đạo và định hướng công ty','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(2,'Phòng IT','Phát triển và vận hành hệ thống công nghệ','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(3,'Phòng Nhân Sự','Quản lý tuyển dụng và phát triển nhân viên','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(4,'Phòng Kế Toán','Quản lý tài chính, lương và chi phí','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(5,'Phòng Marketing','Truyền thông, marketing và phát triển thị trường','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(6,'Vận hành & Hỗ trợ','Đảm bảo vận hành trơn tru và hỗ trợ các bộ phận khác','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(7,'Nghiên cứu & Phát triển','Nghiên cứu công nghệ mới và phát triển sản phẩm sáng tạo','active','2026-06-21 02:44:57','2026-06-21 02:44:57'),(8,'IT','Mô tả trùng','active','2026-06-21 02:44:58','2026-06-21 02:44:58');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `requirements` text COLLATE utf8mb4_unicode_ci,
  `salary_range` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employment_type` enum('fulltime','parttime','internship') COLLATE utf8mb4_unicode_ci DEFAULT 'fulltime',
  `deadline` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_postings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_balances`
--

DROP TABLE IF EXISTS `leave_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_balances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `year` int NOT NULL,
  `total_days` float NOT NULL DEFAULT '12',
  `used_days` float NOT NULL DEFAULT '0',
  `pending_days` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `leave_balances_user_id_year` (`user_id`,`year`),
  CONSTRAINT `leave_balances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_balances`
--

LOCK TABLES `leave_balances` WRITE;
/*!40000 ALTER TABLE `leave_balances` DISABLE KEYS */;
INSERT INTO `leave_balances` VALUES (1,4,2026,12,0,0),(2,1,2026,12,0,0),(3,6,2026,12,2,0),(4,7,2026,12,5,0),(5,8,2026,12,0,1),(6,9,2026,12,0,0),(7,10,2026,12,0,0),(8,2,2026,12,0,4),(9,3,2026,12,0,0),(10,5,2026,12,3,8),(11,23,2026,12,0,0);
/*!40000 ALTER TABLE `leave_balances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('leave','ot') COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` float NOT NULL,
  `ot_hours` float DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `approved_by` int DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `reject_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES (1,5,'leave','2026-06-02','2026-06-02',1,NULL,'Nghỉ phép cá nhân','approved',3,'2026-05-30 09:00:00',NULL,'2026-05-28 08:00:00','2026-05-30 09:00:00'),(2,7,'leave','2026-06-16','2026-06-18',3,NULL,'Nghỉ phép gia đình có việc','approved',3,'2026-06-10 10:00:00',NULL,'2026-06-08 14:00:00','2026-06-10 10:00:00'),(3,6,'leave','2026-06-25','2026-06-25',1,NULL,'Nghỉ phép cá nhân','pending',NULL,NULL,NULL,'2026-06-18 09:00:00','2026-06-18 09:00:00'),(4,8,'ot','2026-06-20','2026-06-20',0,4,'OT deadline project','pending',NULL,NULL,NULL,'2026-06-17 16:00:00','2026-06-17 16:00:00'),(5,9,'leave','2026-05-01','2026-05-03',3,NULL,'Nghỉ phép du lịch','rejected',3,'2026-04-25 11:00:00','Đây là giai đoạn cao điểm, không thể nghỉ','2026-04-20 10:00:00','2026-04-25 11:00:00'),(6,6,'leave','2026-07-10','2026-07-12',3,NULL,'Nghỉ phép gia đình','approved',3,'2026-07-01 09:00:00',NULL,'2026-06-28 10:00:00','2026-07-01 09:00:00'),(7,5,'leave','2026-12-01','2026-12-02',2,NULL,'Nghỉ phép thường niên','pending',NULL,NULL,NULL,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(8,5,'leave','2026-07-01','2026-07-02',2,NULL,'a','pending',NULL,NULL,NULL,'2026-06-22 11:54:09','2026-06-22 11:54:09'),(9,2,'leave','2026-07-01','2026-07-02',2,NULL,'a','pending',NULL,NULL,NULL,'2026-06-22 12:10:53','2026-06-22 12:10:53');
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payrolls`
--

DROP TABLE IF EXISTS `payrolls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payrolls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_salary` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(15,2) NOT NULL DEFAULT '0.00',
  `net_salary` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('draft','calculated','approved','paid') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `is_payslip_sent` tinyint(1) DEFAULT '0',
  `payment_date` datetime DEFAULT NULL,
  `allowance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `bonus` decimal(15,2) NOT NULL DEFAULT '0.00',
  `deduction` decimal(15,2) NOT NULL DEFAULT '0.00',
  `advance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `insurance_company` decimal(15,2) NOT NULL DEFAULT '0.00',
  `insurance_employee` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payrolls_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payrolls`
--

LOCK TABLES `payrolls` WRITE;
/*!40000 ALTER TABLE `payrolls` DISABLE KEYS */;
INSERT INTO `payrolls` VALUES (1,6,'2026-06',16000000.00,595000.00,21525000.00,'paid',1,'2026-06-25 10:00:00',5000000.00,3000000.00,200000.00,0.00,3360000.00,1680000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(2,7,'2026-06',15000000.00,325000.00,8600000.00,'approved',0,NULL,500000.00,0.00,0.00,5000000.00,3150000.00,1575000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(3,8,'2026-06',8000000.00,0.00,3960000.00,'calculated',0,NULL,0.00,0.00,200000.00,3000000.00,1680000.00,840000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(4,10,'2026-06',14000000.00,238000.00,12492000.00,'calculated',0,NULL,700000.00,0.00,500000.00,0.00,2940000.00,1470000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(5,4,'2026-06',20000000.00,1395000.00,16505000.00,'draft',0,NULL,0.00,0.00,0.00,0.00,4200000.00,2100000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(6,22,'2026-06',60000000.00,7771500.00,43714500.00,'draft',0,NULL,0.00,0.00,0.00,0.00,9360000.00,4914000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(7,2,'2026-11',18000000.00,261000.00,15849000.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,1890000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(8,3,'2026-11',25000000.00,956250.00,21418750.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,2625000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(9,4,'2026-11',20000000.00,440000.00,17460000.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,2100000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(10,5,'2026-11',15000000.00,121250.00,13303750.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,1575000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(11,6,'2026-11',16000000.00,166000.00,14154000.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,1680000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(12,7,'2026-11',15000000.00,121250.00,8303750.00,'approved',1,NULL,0.00,0.00,0.00,5000000.00,0.00,1575000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(13,8,'2026-11',8000000.00,0.00,8000000.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,0.00,'2026-06-22 11:52:38','2026-06-22 11:52:38'),(14,10,'2026-11',14000000.00,76500.00,12453500.00,'approved',1,NULL,0.00,0.00,0.00,0.00,0.00,1470000.00,'2026-06-22 11:52:38','2026-06-22 11:52:38');
/*!40000 ALTER TABLE `payrolls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performance_reviews`
--

DROP TABLE IF EXISTS `performance_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `rating` enum('A','B','C','D') COLLATE utf8mb4_unicode_ci NOT NULL,
  `kpi_score` float NOT NULL,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `reviewer_id` (`reviewer_id`),
  CONSTRAINT `performance_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `performance_reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance_reviews`
--

LOCK TABLES `performance_reviews` WRITE;
/*!40000 ALTER TABLE `performance_reviews` DISABLE KEYS */;
INSERT INTO `performance_reviews` VALUES (1,6,3,3,2026,'A',92.5,'Hiệu suất xuất sắc, hoàn thành vượt KPI','2026-06-22 11:52:37','2026-06-22 11:52:37'),(2,7,3,3,2026,'B',78,'Đạt yêu cầu, cần cải thiện tốc độ delivery','2026-06-22 11:52:37','2026-06-22 11:52:37'),(3,8,3,3,2026,'B',81.5,'Sáng tạo tốt, đúng deadline','2026-06-22 11:52:37','2026-06-22 11:52:37'),(4,9,3,3,2026,'C',65,'Cần nỗ lực thêm, hay đến trễ','2026-06-22 11:52:37','2026-06-22 11:52:37');
/*!40000 ALTER TABLE `performance_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `face_descriptor` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,6,'Lê Văn Bình','0901234561','45 Lê Lợi, Q.1, TP.HCM',NULL,'Vietcombank','1023456786','LE VAN BINH',NULL),(2,7,'Phạm Thị Cúc','0901234562','78 Nguyễn Trãi, Q.5, TP.HCM',NULL,'Techcombank','1923456787','PHAM THI CUC',NULL),(3,8,'Ngô Văn Đức','0901234563','12 Đinh Tiên Hoàng, Q.BT, HCM',NULL,'MB Bank','8823456788','NGO VAN DUC',NULL),(4,9,'Hoàng Thị Em','0901234564','99 Cộng Hòa, Q.TB, TP.HCM',NULL,'BIDV','3123456789','HOANG THI EM',NULL),(5,10,'Vũ Văn Phong','0901234565','56 Hai Bà Trưng, Q.3, TP.HCM',NULL,'Agribank','5423456780','VU VAN PHONG',NULL),(6,4,'Accountant','0900000000',NULL,NULL,'Vietcombank','1000000004','ACCOUNTANT',NULL),(7,1,'Admin','0900000000',NULL,NULL,'Vietcombank','1000000001','ADMIN',NULL),(8,2,'HR','0900000000',NULL,NULL,'Vietcombank','1000000002','HR',NULL),(9,3,'Manager','0900000000',NULL,NULL,'Vietcombank','1000000003','MANAGER',NULL),(10,5,'Employee','0900000000',NULL,NULL,'Vietcombank','1000000005','EMPLOYEE',NULL),(11,23,'Trần Văn C',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_proposals`
--

DROP TABLE IF EXISTS `promotion_proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_proposals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `proposed_by` int NOT NULL,
  `current_position` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposed_position` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `proposed_by` (`proposed_by`),
  CONSTRAINT `promotion_proposals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `promotion_proposals_ibfk_2` FOREIGN KEY (`proposed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_proposals`
--

LOCK TABLES `promotion_proposals` WRITE;
/*!40000 ALTER TABLE `promotion_proposals` DISABLE KEYS */;
INSERT INTO `promotion_proposals` VALUES (1,6,3,'Junior Developer','Senior Developer','Nhân viên đã làm việc xuất sắc 2 năm, nắm vững kỹ năng và mentor được junior','Approved','2026-04-01 09:00:00','2026-06-22 11:52:37'),(2,10,3,'HR Officer','HR Team Lead','Có kinh nghiệm xử lý tuyển dụng độc lập, phù hợp làm team lead','Pending','2026-06-01 10:00:00','2026-06-22 11:52:38');
/*!40000 ALTER TABLE `promotion_proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_adjustments`
--

DROP TABLE IF EXISTS `salary_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_adjustments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kind` enum('income','deduction') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` bigint NOT NULL,
  `apply_month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `recurring` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','applied') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `entered_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `entered_by` (`entered_by`),
  CONSTRAINT `salary_adjustments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `salary_adjustments_ibfk_2` FOREIGN KEY (`entered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_adjustments`
--

LOCK TABLES `salary_adjustments` WRITE;
/*!40000 ALTER TABLE `salary_adjustments` DISABLE KEYS */;
INSERT INTO `salary_adjustments` VALUES (1,'income',6,'Thưởng dự án',3000000,'2026-06','Hoàn thành dự án trước deadline',0,'applied',4,'2026-06-01 09:00:00','2026-06-01 09:00:00'),(2,'income',7,'Phụ cấp xăng xe',500000,'2026-06','Phụ cấp đi lại hàng tháng',1,'applied',4,'2026-06-01 09:00:00','2026-06-01 09:00:00'),(3,'deduction',8,'Phạt đi trễ',200000,'2026-06','Đến trễ 3 lần trong tháng',0,'applied',4,'2026-06-01 09:00:00','2026-06-01 09:00:00'),(4,'income',6,'Thưởng KPI Q1',2000000,'2026-06','KPI Q1 đạt 92.5 điểm (xếp loại A)',0,'applied',4,'2026-06-05 10:00:00','2026-06-05 10:00:00'),(5,'income',9,'Phụ cấp ăn trưa',700000,'2026-06','Phụ cấp ăn trưa định kỳ',1,'pending',4,'2026-06-10 09:00:00','2026-06-22 11:52:38'),(6,'deduction',10,'Trừ nghỉ không phép',500000,'2026-06','Nghỉ 1 ngày không xin phép',0,'pending',4,'2026-06-12 11:00:00','2026-06-22 11:52:38'),(7,'income',7,'Thưởng dự án',1500000,'2026-11','Thực hiện test case',0,'pending',4,'2026-06-22 11:52:38','2026-06-22 11:52:38');
/*!40000 ALTER TABLE `salary_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('todo','in_progress','review','done','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `due_date` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `assigned_to_id` int NOT NULL,
  `assigned_by_id` int NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assigned_to_id` (`assigned_to_id`),
  KEY `assigned_by_id` (`assigned_by_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_by_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'Phát triển module Payroll FE','done','2026-06-15','Hoàn thiện UI trang tính lương cho kế toán','high',6,3,'2026-06-14 16:00:00','2026-05-20 09:00:00','2026-06-14 16:00:00'),(2,'Fix bug login page','in_progress','2026-06-21','Xử lý lỗi refresh token hết hạn','urgent',6,3,NULL,'2026-06-17 10:00:00','2026-06-22 11:52:37'),(3,'Viết tài liệu API','todo','2026-06-30','Tài liệu Swagger cho các endpoint mới','medium',7,3,NULL,'2026-06-10 14:00:00','2026-06-22 11:52:37'),(4,'Thiết kế banner tháng 7','review','2026-06-25','Banner quảng cáo cho chiến dịch Q3','medium',8,3,NULL,'2026-06-12 09:00:00','2026-06-22 11:52:37'),(5,'SEO trang chủ','todo','2026-07-15','Tối ưu SEO cho trang chủ website công ty','low',9,3,NULL,'2026-06-15 11:00:00','2026-06-22 11:52:37'),(6,'Onboard nhân viên mới','in_progress','2026-06-28','Chuẩn bị tài liệu và hướng dẫn cho nhân viên tháng 7','high',10,3,NULL,'2026-06-16 08:00:00','2026-06-22 11:52:37'),(7,'Review code PR#42','done','2026-06-10','Review pull request module attendance','high',7,3,'2026-06-09 15:00:00','2026-06-08 10:00:00','2026-06-09 15:00:00'),(8,'Testing module tạm ứng','cancelled','2026-06-05','Test đầy đủ luồng advance request','high',6,3,NULL,'2026-06-01 09:00:00','2026-06-22 11:52:37'),(9,'Task test manager','todo','2026-07-01','Manager tạo task','medium',7,3,NULL,'2026-06-22 11:52:38','2026-06-22 11:52:38');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tax_insurance_configs`
--

DROP TABLE IF EXISTS `tax_insurance_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tax_insurance_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `social_insurance_rate` float NOT NULL DEFAULT '8',
  `health_insurance_rate` float NOT NULL DEFAULT '1.5',
  `unemployment_insurance_rate` float NOT NULL DEFAULT '1',
  `base_salary` decimal(15,2) NOT NULL DEFAULT '2340000.00',
  `max_insurance_salary` decimal(15,2) NOT NULL DEFAULT '46800000.00',
  `personal_deduction` decimal(15,2) NOT NULL DEFAULT '11000000.00',
  `dependent_deduction` decimal(15,2) NOT NULL DEFAULT '4400000.00',
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax_insurance_configs`
--

LOCK TABLES `tax_insurance_configs` WRITE;
/*!40000 ALTER TABLE `tax_insurance_configs` DISABLE KEYS */;
INSERT INTO `tax_insurance_configs` VALUES (1,8,1.5,1,2340000.00,46800000.00,11000000.00,4400000.00,'2026-06-22 11:52:37');
/*!40000 ALTER TABLE `tax_insurance_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin','hr','manager','accountant','employee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'employee',
  `department_id` int DEFAULT NULL,
  `status` enum('inactive','active') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@example.com','$2b$10$dM1Dn8ygkWxPm41du7ZFEOe/JL09liBtzsCv0sLYz9wiUIrubdoV.','admin',1,'active','2026-06-22 11:52:37'),(2,'HR','hr@example.com','$2b$10$ZyhnP7.vUXxd1XUU5n3JUOSN7O8ipOli.R.pjfNF4/r9EnrPBFEwO','hr',3,'active','2026-06-22 11:52:37'),(3,'Manager','manager@example.com','$2b$10$CLE0xOpVfE6UarH5bDYK6.dD3K2NCh0Ka8eJaiIvkwUg08G8QgE/S','manager',2,'active','2026-06-22 11:52:37'),(4,'Accountant','accountant@example.com','$2b$10$kvZSQ6WeO45qo10NLQgWBO7vIyCBG8HghUbdBtuAdhEkQ1ZsxMn6S','accountant',4,'active','2026-06-22 11:52:37'),(5,'Employee','user@example.com','$2b$10$KKJb7KDbtAWZzGkV16q6OOfoZkdk8YjjbxFp118t5xIM0fE28Ozc2','employee',2,'active','2026-06-22 11:52:37'),(6,'Lê Văn Bình','employee1@example.com','$2b$10$KKJb7KDbtAWZzGkV16q6OOfoZkdk8YjjbxFp118t5xIM0fE28Ozc2','employee',2,'active','2026-06-22 11:52:37'),(7,'Phạm Thị Cúc','employee2@example.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',2,'active','2026-06-22 11:52:37'),(8,'Ngô Văn Đức','employee3@example.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',5,'active','2026-06-22 11:52:37'),(9,'Hoàng Thị Em','employee4@example.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',5,'active','2026-06-22 11:52:37'),(10,'Vũ Văn Phong','employee5@example.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',3,'active','2026-06-22 11:52:37'),(11,'Trần Văn A','user11@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',2,'active','2026-06-22 11:52:38'),(12,'Nguyễn Thị B','user12@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',2,'active','2026-06-22 11:52:38'),(13,'Lê Văn C','user13@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',3,'active','2026-06-22 11:52:38'),(14,'Phạm Thị D','user14@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',4,'active','2026-06-22 11:52:38'),(15,'Hoàng Văn E','user15@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',5,'active','2026-06-22 11:52:38'),(16,'Đỗ Thị F','user16@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',2,'active','2026-06-22 11:52:38'),(17,'Vũ Văn G','user17@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',3,'active','2026-06-22 11:52:38'),(18,'Bùi Thị H','user18@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',4,'inactive','2026-06-22 11:52:38'),(19,'Đinh Văn I','user19@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',5,'active','2026-06-22 11:52:38'),(20,'Phan Thị K','user20@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',2,'active','2026-06-22 11:52:38'),(21,'Cao Văn L','user21@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','employee',3,'active','2026-06-22 11:52:38'),(22,'Giám Đốc Test','director.test@atria.vn','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','manager',1,'active','2026-06-22 11:52:38'),(23,'Trần Văn C','tranvanc@example.com','$2b$10$XM2U5v6hgalDZ1Wd4Tvld./Faw.QZmQtsyTFU7u05sxbEZ6nlV50.','employee',2,'active','2026-06-23 10:27:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-25 15:49:45
