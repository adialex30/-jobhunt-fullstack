-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: jobhunt_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `applicant_id` int NOT NULL,
  `cover_letter` text,
  `status` enum('pending','reviewed','rejected') DEFAULT 'pending',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application` (`job_id`,`applicant_id`),
  KEY `idx_job` (`job_id`),
  KEY `idx_applicant` (`applicant_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,1,'Saya memiliki pengalaman lebih dari 4 tahun dalam desain antarmuka dan interaksi spatial computing. Bersemangat untuk bergabung dengan tim!','rejected','2026-10-04 04:22:34'),(2,2,2,'Portofolio brand identity dan narrative design saya terlampir. Sangat tertarik dengan visi industrial climate platform.','reviewed','2026-10-04 04:22:34'),(3,3,1,'Memiliki ketertarikan mendalam dalam arsitektur AI dan WebGL. Siap mengikuti tahap wawancara.','rejected','2026-10-04 04:22:34'),(4,5,2,'Saya sangat tertarik dengan posisi Fullstack Engineer ini!','rejected','2026-10-04 04:25:22'),(5,2,1,'Saya sangat tertarik untuk melamar posisi ini karena memiliki keahlian dan portofolio yang relevan dengan kebutuhan tim.','rejected','2026-10-04 04:44:40'),(6,5,1,'Saya sangat tertarik untuk melamar posisi ini karena memiliki keahlian dan portofolio yang relevan dengan kebutuhan tim.','reviewed','2026-10-04 04:54:14'),(7,7,2,'cfghnbmm','rejected','2026-10-04 07:14:03'),(9,3,2,'vdbshan','reviewed','2026-10-04 07:19:44'),(10,1,2,NULL,'pending','2026-10-04 08:04:12'),(11,9,2,NULL,'pending','2026-10-04 08:09:50'),(12,14,9,'Saya sangat tertarik dengan posisi Senior Cloud Architect ini.','reviewed','2026-10-04 13:49:15'),(13,4,1,'zsdrtgbn','pending','2026-10-04 14:06:18'),(14,13,2,'aaaa','rejected','2026-10-04 14:11:23');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recruiter_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `company` varchar(150) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `type` enum('full-time','part-time','contract','internship') NOT NULL,
  `description` text NOT NULL,
  `requirements` text,
  `salary_min` int DEFAULT NULL,
  `salary_max` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_recruiter` (`recruiter_id`),
  KEY `idx_active` (`is_active`),
  KEY `idx_type` (`type`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,4,'Principal Product Designer, Reality OS','Kinetic Spatial Labs','San Francisco (Hybrid)','full-time','Spearhead foundational ergonomic interfaces and multimodal spatial canvas frameworks for next-generation hardware platforms.','9+ years in multi-modal systems design, Figma, Three.js spatial frameworks.',21000000,25000000,1,'2026-10-03 10:34:26'),(2,4,'VP of Brand Systems & Narrative','Verdant Synthetic','Remote (Worldwide)','full-time','Establish global visual identity and voice of industrial climate-computing infrastructure firm.','Executive creative leadership, typography, editorial and film production.',24000000,28000000,1,'2026-10-03 10:34:26'),(3,4,'Founding Design Technologist','Mirage Applied AI','New York • SoHo Studio','full-time','Bridge high-fidelity design prototypes and webGL shaders with generative model latency pipelines.','Proficiency in React, Three.js, WebGL, and LLM tooling.',19500000,22000000,1,'2026-10-03 10:34:26'),(4,4,'Director of Digital Experiences','Origami Publishing Co.','London / Hybrid','contract','Reinvent long-form cultural journalism across reader platforms and tablet magazines.','Digital editorial architecture, reader research, minimum 6 years experience.',18000000,21000000,1,'2026-10-03 10:34:26'),(5,4,'Senior Fullstack Engineer','Aura Platform Labs','Jakarta • Hybrid','full-time','Develop and scale mission-critical recruitment workflows with React, Node.js, and MySQL.','5+ years experience in fullstack JavaScript/TypeScript, SQL optimization, Docker.',18000000,26000000,1,'2026-10-03 10:34:26'),(6,4,'Product Management Intern','Quantum Leap Tech','Bandung • Onsite','internship','Assist in user story mapping, customer interviews, and cross-functional product analytics.','Passion for digital products, basic data analysis, strong communication skills.',4000000,6000000,1,'2026-10-03 10:34:26'),(7,4,'Senior Backend Engineer (Go & Node.js)','CloudWave Systems','Remote (Indonesia)','full-time','Build real-time message streaming, background job queues, and scalable microservices.','Deep experience in Go/Node.js, PostgreSQL/MySQL, Redis caching, gRPC.',20000000,28000000,1,'2026-10-03 10:34:26'),(9,4,'Lead AI Infrastructure Architect','Neural Systems Corp','Remote / Jakarta','full-time','Lead distributed LLM model serving and orchestration infrastructure on Kubernetes.','Experience in PyTorch, Triton, vLLM, Kubernetes.',30000000,45000000,1,'2026-10-03 10:35:12'),(13,4,'QA Engineer','Intorama','Surabaya (Hybrid)','part-time','kerja',NULL,150000,200000,1,'2026-10-04 08:13:27'),(14,8,'Senior Cloud Architect','Quantum Systems','Jakarta','full-time','Lead next-generation multi-cloud infrastructure projects.','Kubernetes, Go, AWS/GCP, 5+ years experience.',25000000,35000000,1,'2026-10-04 13:49:14'),(15,4,'Project Manager','PT Muno Mastia','Remote','full-time','mmmm',NULL,1500000,2000000,1,'2026-10-04 14:59:25'),(16,4,'Node Js Developer','PT Info Adi tama','Bali','part-time','develop application trades','Typescript, Node Js, React Js',14000000,20000000,1,'2026-10-05 06:11:31');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('job_seeker','recruiter') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Budi Santoso','budi@example.com','$2a$10$inkgXCEjPvV.gh13jBpDO.zPnyCI0wa0G3FR0.JqRu8nnAZCMTuzW','job_seeker','2026-09-28 14:25:34'),(2,'herman','herman@example.com','$2a$10$5GGvlqcaqEafbVeBd0v2fuGh0zzZrLwXr7qVi8L7wCkofPuHFjB4q','job_seeker','2026-10-03 03:50:09'),(3,'recruiter','recruiter@example.com','$2a$10$LYVJni8TY0AHniFh3WAz2epSH9RxllLAo20efcfH56sbtBFM3GR2W','job_seeker','2026-10-03 03:51:35'),(4,'recruiters','recruiters@example.com','$2a$10$ERwTbWq5vWyJsrxdi7BK3uPjjo1YXOhZx0f1GzH8m.ImJlgoxg922','recruiter','2026-10-03 03:52:24'),(5,'Alex','alex@recruiter.com','$2a$10$CagMACgkphPGWVw58k3vVO19bqhp0jTgjAsD8DkgJXZSBbFyHlHXy','recruiter','2026-10-03 05:01:47'),(6,'Test Seeker','test_seeker_1791121226073@example.com','$2a$10$nTIsGOyMTjKmTliQaWWk8eg03wBAIECGWD3CtE9IcQu.Juqr4n25i','job_seeker','2026-10-04 13:40:26'),(7,'John Doe','test_seeker_1791121344132@example.com','$2a$10$W.7bBiCOVxdIB9wN6JJkve7T76VLU2hFDBTPavMKvxDJAKuOwI33e','job_seeker','2026-10-04 13:42:24'),(8,'Talent Acquisition Team','recruiter_1791121754708@company.com','$2a$10$A1604gWdADgKU0B/HycsTu.VEkihOLXRIpNRX/PVsFOo/s8LJlRpm','recruiter','2026-10-04 13:49:14'),(9,'Rian Pratama','seeker_1791121754708@applicant.com','$2a$10$4KP6BY1oInCZHjGVDUnaweoX8VOu6KJKvDYi18dhMO/BcvNFprrgu','job_seeker','2026-10-04 13:49:15');
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

-- Dump completed on 2026-10-07  9:12:04
