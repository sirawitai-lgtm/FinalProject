-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 18, 2026 at 01:36 PM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `StockPro`
--

-- --------------------------------------------------------

--
-- Table structure for table `Daily_summaries`
--

CREATE TABLE `Daily_summaries` (
  `id` int NOT NULL,
  `snapshot_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `summary_date` date NOT NULL,
  `total_in` int NOT NULL DEFAULT '0',
  `total_out` int NOT NULL DEFAULT '0',
  `net_change` int NOT NULL DEFAULT '0',
  `detail_json` json DEFAULT NULL,
  `low_count` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Daily_summaries`
--

INSERT INTO `Daily_summaries` (`id`, `snapshot_at`, `summary_date`, `total_in`, `total_out`, `net_change`, `detail_json`, `low_count`) VALUES
(1, '2026-03-18 05:33:13', '2026-03-18', 23, 0, 23, '[{\"in\": \"23\", \"min\": 20, \"net\": 23, \"out\": \"0\", \"qty\": 39, \"name\": \"Arabica Coffee Beans\", \"is_low\": false, \"product_id\": 1}, {\"in\": \"0\", \"min\": 20, \"net\": 0, \"out\": \"0\", \"qty\": 18, \"name\": \"Fresh Milk (1L)\", \"is_low\": true, \"product_id\": 2}, {\"in\": \"0\", \"min\": 10, \"net\": 0, \"out\": \"0\", \"qty\": 20, \"name\": \"Green Tea\", \"is_low\": false, \"product_id\": 7}, {\"in\": \"0\", \"min\": 10, \"net\": 0, \"out\": \"0\", \"qty\": 10, \"name\": \"Soda Water\", \"is_low\": false, \"product_id\": 3}, {\"in\": \"0\", \"min\": 15, \"net\": 0, \"out\": \"0\", \"qty\": 45, \"name\": \"Yogurt\", \"is_low\": false, \"product_id\": 8}]', 1),
(2, '2026-03-18 05:41:39', '2026-03-18', 23, 25, -2, '[{\"in\": \"23\", \"min\": 20, \"net\": 23, \"out\": \"0\", \"qty\": 39, \"name\": \"Arabica Coffee Beans\", \"is_low\": false, \"product_id\": 1}, {\"in\": \"0\", \"min\": 20, \"net\": -8, \"out\": \"8\", \"qty\": 10, \"name\": \"Fresh Milk (1L)\", \"is_low\": true, \"product_id\": 2}, {\"in\": \"0\", \"min\": 10, \"net\": -12, \"out\": \"12\", \"qty\": 8, \"name\": \"Green Tea\", \"is_low\": true, \"product_id\": 7}, {\"in\": \"0\", \"min\": 10, \"net\": -5, \"out\": \"5\", \"qty\": 5, \"name\": \"Soda Water\", \"is_low\": true, \"product_id\": 3}, {\"in\": \"0\", \"min\": 15, \"net\": 0, \"out\": \"0\", \"qty\": 45, \"name\": \"Yogurt\", \"is_low\": false, \"product_id\": 8}]', 3),
(3, '2026-03-18 05:45:34', '2026-03-18', 23, 25, -2, '[{\"in\": \"23\", \"min\": 20, \"net\": 23, \"out\": \"0\", \"qty\": 39, \"name\": \"Arabica Coffee Beans\", \"is_low\": false, \"product_id\": 1}, {\"in\": \"0\", \"min\": 20, \"net\": -8, \"out\": \"8\", \"qty\": 10, \"name\": \"Fresh Milk (1L)\", \"is_low\": true, \"product_id\": 2}, {\"in\": \"0\", \"min\": 10, \"net\": -12, \"out\": \"12\", \"qty\": 8, \"name\": \"Green Tea\", \"is_low\": true, \"product_id\": 7}, {\"in\": \"0\", \"min\": 10, \"net\": -5, \"out\": \"5\", \"qty\": 5, \"name\": \"Soda Water\", \"is_low\": true, \"product_id\": 3}, {\"in\": \"0\", \"min\": 15, \"net\": 0, \"out\": \"0\", \"qty\": 45, \"name\": \"Yogurt\", \"is_low\": false, \"product_id\": 8}]', 3),
(4, '2026-03-18 13:35:38', '2026-03-18', 2651, 2348, 303, '[{\"in\": \"282\", \"min\": 20, \"net\": 282, \"out\": \"0\", \"qty\": 298, \"name\": \"Arabica Coffee Beans\", \"is_low\": false, \"product_id\": 1}, {\"in\": \"0\", \"min\": 23, \"net\": 0, \"out\": \"0\", \"qty\": 23, \"name\": \"asd\", \"is_low\": false, \"product_id\": 23}, {\"in\": \"46\", \"min\": 20, \"net\": 38, \"out\": \"8\", \"qty\": 56, \"name\": \"Fresh Milk (1L)\", \"is_low\": false, \"product_id\": 2}, {\"in\": \"0\", \"min\": 24, \"net\": -12, \"out\": \"12\", \"qty\": 8, \"name\": \"Green Tea\", \"is_low\": true, \"product_id\": 20}, {\"in\": \"0\", \"min\": 10, \"net\": -5, \"out\": \"5\", \"qty\": 5, \"name\": \"Soda Water\", \"is_low\": true, \"product_id\": 3}, {\"in\": \"2323\", \"min\": 15, \"net\": 0, \"out\": \"2323\", \"qty\": 45, \"name\": \"Yogurt\", \"is_low\": false, \"product_id\": 8}]', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Daily_summaries`
--
ALTER TABLE `Daily_summaries`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Daily_summaries`
--
ALTER TABLE `Daily_summaries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
