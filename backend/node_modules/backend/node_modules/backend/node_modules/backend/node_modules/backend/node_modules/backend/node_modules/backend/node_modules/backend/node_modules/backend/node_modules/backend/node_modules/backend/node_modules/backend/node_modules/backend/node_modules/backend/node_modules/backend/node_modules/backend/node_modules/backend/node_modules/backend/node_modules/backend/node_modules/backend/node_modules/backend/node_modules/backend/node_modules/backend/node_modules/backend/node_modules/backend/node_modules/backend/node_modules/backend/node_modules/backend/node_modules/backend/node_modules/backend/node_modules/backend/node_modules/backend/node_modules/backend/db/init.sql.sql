-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: eco_dataset
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `challenge_history`
--

DROP TABLE IF EXISTS `challenge_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenge_history` (
  `history_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `challenge_id` int NOT NULL,
  `completed_at` date NOT NULL,
  `points_earned` int NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `challenge_id` (`challenge_id`),
  CONSTRAINT `challenge_history_ibfk_1` FOREIGN KEY (`challenge_id`) REFERENCES `eco_challenges` (`challenge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenge_history`
--

LOCK TABLES `challenge_history` WRITE;
/*!40000 ALTER TABLE `challenge_history` DISABLE KEYS */;
INSERT INTO `challenge_history` VALUES ('3a1b5051-0010-476b-b07e-539ea3ca366a','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',12,'2025-05-07',55),('4f58466b-2fef-4e59-8afc-76bb0cbc6d16','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',2,'2025-04-08',75),('6115cc5f-1da7-4652-a7d1-5587a393d9ed','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',3,'2025-05-07',50),('78e8b439-ac2e-449c-b4a1-c8986cb3c289','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',1,'2025-05-04',100),('a13404e3-a44d-4b26-b211-c1baf55e47f8','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',13,'2025-05-04',30),('df2b8cee-0c27-4928-a205-2599f50c0b21','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',13,'2025-05-07',30),('e2229982-c147-41e7-8427-8d56e85e98d3','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',3,'2025-05-04',50),('eaf147e4-f2f7-4c37-8b1b-97428d1aa3e6','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',14,'2025-05-04',25);
/*!40000 ALTER TABLE `challenge_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eco_challenges`
--

DROP TABLE IF EXISTS `eco_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eco_challenges` (
  `challenge_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `duration_days` int NOT NULL,
  `points` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`challenge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eco_challenges`
--

LOCK TABLES `eco_challenges` WRITE;
/*!40000 ALTER TABLE `eco_challenges` DISABLE KEYS */;
INSERT INTO `eco_challenges` VALUES (1,'Reduce Plastic Usage','Avoid using single-use plastics for a week',7,100,'2025-03-13 08:27:16'),(2,'Energy Conservation','Turn off unused lights and appliances',5,75,'2025-03-13 08:27:16'),(3,'Water Saving Challenge','Reduce your daily water consumption',3,50,'2025-03-13 08:27:16'),(4,'Reduce Shower Time','Limit your daily showers to 5 minutes to conserve water.',7,50,'2025-04-09 14:28:23'),(5,'No Single-Use Plastics','Avoid using plastic straws, cutlery, and bottles. Switch to reusable alternatives.',7,60,'2025-04-09 14:28:23'),(6,'Meatless Week','Eat plant-based meals every day to reduce your carbon footprint from meat consumption.',7,70,'2025-04-09 14:28:23'),(7,'Turn Off Unused Lights','Turn off lights and electronic devices when not in use to save electricity.',5,40,'2025-04-09 14:28:23'),(8,'Bring Your Own Bag','Use reusable shopping bags instead of plastic ones during grocery runs.',5,45,'2025-04-09 14:28:23'),(9,'Eco-Friendly Commuting','Use public transportation instead of personal vehicles for your daily commute.',7,65,'2025-04-09 14:28:23'),(10,'No Fast Fashion','Avoid buying new clothes. Try wearing what you already have or swap with friends.',10,80,'2025-04-09 14:44:50'),(11,'Recycle Daily','Separate recyclables and dispose of them properly each day',7,60,'2025-04-22 02:00:00'),(12,'Zero-Waste Cooking','Use all food scraps or leftovers while cooking',5,55,'2025-04-22 02:00:00'),(13,'Digital Detox Day','Avoid unnecessary screen time to save energy',1,30,'2025-04-22 02:00:00'),(14,'Paper-Free Day','Go one day without using paper products',1,25,'2025-04-22 02:00:00'),(15,'Reuse Before You Buy','Repurpose or reuse items before purchasing new ones',7,70,'2025-04-22 02:00:00'),(16,'Green Cleaning','Use homemade or eco-friendly cleaning products',5,50,'2025-04-22 02:00:00'),(17,'Plastic-Free Groceries','Avoid buying groceries with plastic packaging',7,65,'2025-04-22 02:00:00'),(18,'Support Local Produce','Buy only locally grown produce for a week',7,60,'2025-04-22 02:00:00'),(19,'Conscious Showering','Turn off the shower while soaping or shampooing',7,50,'2025-04-22 02:00:00'),(20,'Minimalist Living Challenge','Declutter and donate unused items from your home',10,80,'2025-04-22 02:00:00');
/*!40000 ALTER TABLE `eco_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `is_eco_friendly` tinyint(1) NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Plastic water bottle','Single-use plastic bottle',0,'Beverage containers'),(2,'Reusable glass bottle','Durable and eco-friendly',1,'Beverage containers'),(3,'Stainless steel bottle','Keeps drinks cold',1,'Beverage containers'),(4,'Plastic Straw','Disposable plastic straw',0,'Utensils'),(5,'Plastic Grocery Bag','Conventional grocery bag',0,'Bags'),(6,'Paper Towel','Single-use paper towel',0,'Cleaning'),(7,'Disposable Razor','Plastic razor for one-time use',0,'Personal Care'),(8,'Metal Straw','Reusable stainless steel straw',1,'Utensils'),(9,'Reusable Shopping Bag','Cloth bag for groceries',1,'Bags'),(10,'Reusable Cleaning Cloth','Microfiber cloth for cleaning',1,'Cleaning'),(11,'Safety Razor','Durable razor with replaceable blades',1,'Personal Care'),(12,'Plastic Cutlery Set','Disposable fork, spoon, and knife made of plastic',0,'Utensils'),(13,'Styrofoam Food Container','Single-use foam container for food delivery',0,'Food Packaging'),(14,'Plastic Wrap','Plastic film used to wrap food',0,'Kitchen'),(15,'Conventional Light Bulb','Non-energy-saving incandescent bulb',0,'Home Appliances'),(16,'Battery-powered Air Freshener','Disposable air freshener with plastic casing',0,'Home Essentials'),(17,'Bamboo Cutlery Set','Reusable fork, spoon, and knife made of bamboo',1,'Utensils'),(18,'Compostable Food Container','Biodegradable container for food delivery',1,'Food Packaging'),(19,'Beeswax Wrap','Reusable wrap for food storage made from beeswax',1,'Kitchen'),(20,'LED Light Bulb','Energy-efficient light bulb with long lifespan',1,'Home Appliances'),(21,'Essential Oil Diffuser','Eco-friendly air freshener using natural oils',1,'Home Essentials'),(22,'Plastic Coffee Cup','Disposable coffee cup with plastic lid',0,'Drinkware'),(23,'Synthetic Sponge','Kitchen sponge made from synthetic materials',0,'Cleaning'),(24,'Plastic Toothbrush','Standard toothbrush made of plastic',0,'Personal Care'),(25,'Aerosol Air Freshener','Pressurized air freshener with chemicals',0,'Home Essentials'),(26,'Plastic Food Storage Container','Single-use plastic containers',0,'Kitchen'),(27,'Disposable Diaper','Conventional diaper made from plastic and chemicals',0,'Baby Care'),(28,'Paper Plate','Single-use disposable paper plate',0,'Utensils'),(29,'Plastic Pen','Non-refillable plastic ballpoint pen',0,'Office Supplies'),(30,'PVC Shower Curtain','Shower curtain made of non-recyclable PVC',0,'Bathroom'),(31,'Plastic Comb','Comb made entirely of plastic',0,'Personal Care'),(32,'Reusable Coffee Cup','Cup made from bamboo or stainless steel',1,'Drinkware'),(33,'Natural Loofah Sponge','Compostable sponge made from loofah plant',1,'Cleaning'),(34,'Bamboo Toothbrush','Toothbrush with a biodegradable bamboo handle',1,'Personal Care'),(35,'Natural Air Freshener Bag','Charcoal-based air purifier bag',1,'Home Essentials'),(36,'Glass Food Storage Container','Durable and reusable glass containers',1,'Kitchen'),(37,'Cloth Diaper','Washable and reusable baby diaper',1,'Baby Care'),(38,'Palm Leaf Plate','Biodegradable plate made from palm leaves',1,'Utensils'),(39,'Refillable Metal Pen','Eco pen made from metal with refillable ink',1,'Office Supplies'),(40,'Organic Cotton Shower Curtain','Biodegradable curtain made from organic cotton',1,'Bathroom'),(41,'Wooden Comb','Comb made from sustainably harvested wood',1,'Personal Care');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_general_ci,
  `preferences` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES ('yPiB2F9XUGWEeFrE1lvB4y3a0Cl1','CYX','zhangyongxuan420@gmail.com','Knowledge is the foundation of change','Electrical Vehicle (EV)');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `recommendation_id` int NOT NULL AUTO_INCREMENT,
  `non_eco_product_id` int NOT NULL,
  `eco_product_id` int NOT NULL,
  PRIMARY KEY (`recommendation_id`),
  KEY `non_eco_product_id` (`non_eco_product_id`),
  KEY `eco_product_id` (`eco_product_id`),
  CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`non_eco_product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`eco_product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
INSERT INTO `recommendations` VALUES (1,1,2),(2,1,3),(3,4,8),(4,5,9),(5,6,10),(6,7,11),(7,12,17),(8,13,18),(9,14,19),(10,15,20),(11,16,21),(12,22,32),(13,23,33),(14,24,34),(15,25,35),(16,26,36),(17,27,37),(18,28,38),(19,29,39),(20,30,40),(21,31,41);
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_challenge_progress`
--

DROP TABLE IF EXISTS `user_challenge_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_challenge_progress` (
  `progress_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `challenge_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `last_check_in` date DEFAULT NULL,
  `completion_status` enum('in_progress','completed','failed') COLLATE utf8mb4_general_ci DEFAULT 'in_progress',
  `current_streak` int DEFAULT '0',
  `completion_count` int DEFAULT '0',
  `total_points_earned` int DEFAULT '0',
  PRIMARY KEY (`progress_id`),
  KEY `user_challenge_progress_ibfk_1` (`challenge_id`),
  CONSTRAINT `user_challenge_progress_ibfk_1` FOREIGN KEY (`challenge_id`) REFERENCES `eco_challenges` (`challenge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_challenge_progress`
--

LOCK TABLES `user_challenge_progress` WRITE;
/*!40000 ALTER TABLE `user_challenge_progress` DISABLE KEYS */;
INSERT INTO `user_challenge_progress` VALUES ('0cc9a5fb-2cae-4bc1-a1da-c6cf39ba19bb','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',2,'2025-03-24','2025-04-08','completed',5,1,75),('2b8d7d27-699f-481a-9404-80956a90ddfc','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',13,'2025-04-30','2025-05-04','completed',0,2,60),('68c368a2-32a3-499e-b977-785f2a8afcdf','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',3,'2025-05-05','2025-05-07','completed',2,1,50),('6a49ed11-2bce-4751-aadd-ea771d3c2580','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',1,'2025-05-04','2025-05-08','in_progress',5,0,0),('7dda0b24-8e32-48d3-81b7-4a3452946f34','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',3,'2025-05-07','2025-05-08','in_progress',2,0,0),('87ff1aa1-b276-4e6a-984f-3a2e641b8442','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',1,'2025-03-13','2025-05-04','completed',0,1,100),('8bbaa6f9-de1c-4594-8124-fe172ad42900','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',14,'2025-04-30','2025-05-04','completed',0,1,25),('a0d299fa-ce53-4bb2-9e5f-dd0f9f74f336','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',12,'2025-04-30','2025-05-07','completed',4,1,55),('c0cc63c6-df0e-4593-97ee-40d7dfdc088d','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',13,'2025-05-07','2025-05-07','completed',1,1,30),('def72468-4695-47c8-a78c-3ccd570fbe46','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1',3,'2025-03-21','2025-05-04','completed',0,2,100);
/*!40000 ALTER TABLE `user_challenge_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_feedback`
--

DROP TABLE IF EXISTS `user_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_feedback` (
  `feedback_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  KEY `uid` (`uid`),
  CONSTRAINT `user_feedback_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `user_feedback_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_feedback`
--

LOCK TABLES `user_feedback` WRITE;
/*!40000 ALTER TABLE `user_feedback` DISABLE KEYS */;
INSERT INTO `user_feedback` VALUES ('e2c7d56a-722c-47ff-939a-62681fccd5f1','yPiB2F9XUGWEeFrE1lvB4y3a0Cl1','Good',5,'2025-04-09 01:11:49');
/*!40000 ALTER TABLE `user_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('yPiB2F9XUGWEeFrE1lvB4y3a0Cl1','zhangyongxuan420@gmail.com','ACE375*1004!z','2025-03-09 03:46:48','2025-04-08 09:06:58');
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

-- Dump completed on 2025-05-08 14:47:44
