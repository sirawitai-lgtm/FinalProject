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
-- Table structure for table `Inventory_logs`
--

CREATE TABLE `Inventory_logs` (
  `Id` int NOT NULL,
  `Product_id` int NOT NULL,
  `Action_type` enum('IN','OUT') NOT NULL,
  `Amount` int NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Inventory_logs`
--

INSERT INTO `Inventory_logs` (`Id`, `Product_id`, `Action_type`, `Amount`, `Created_at`) VALUES
(1, 1, 'IN', 5, '2026-03-15 20:01:29'),
(2, 2, 'OUT', 3, '2026-03-15 20:01:29'),
(3, 1, 'IN', 20, '2026-03-16 08:17:01'),
(4, 3, 'IN', 20, '2026-03-16 08:17:05'),
(5, 8, 'IN', 20, '2026-03-16 08:17:09'),
(6, 2, 'IN', 20, '2026-03-16 08:17:14'),
(7, 1, 'OUT', 30, '2026-03-16 08:17:38'),
(8, 1, 'OUT', 5, '2026-03-16 08:17:45'),
(9, 2, 'OUT', 30, '2026-03-16 08:17:51'),
(10, 1, 'IN', 30, '2026-03-16 08:32:26'),
(11, 2, 'IN', 5, '2026-03-16 08:38:42'),
(12, 1, 'OUT', 25, '2026-03-16 08:38:48'),
(13, 1, 'OUT', 25, '2026-03-16 08:38:52'),
(14, 1, 'IN', 5, '2026-03-16 08:38:58'),
(15, 1, 'IN', 50, '2026-03-16 08:44:44'),
(16, 2, 'IN', 20, '2026-03-16 08:44:47'),
(17, 3, 'IN', 30, '2026-03-16 08:44:50'),
(18, 2, 'OUT', 15, '2026-03-16 08:44:55'),
(19, 3, 'OUT', 39, '2026-03-16 08:45:03'),
(20, 3, 'OUT', 9, '2026-03-16 08:45:10'),
(21, 2, 'IN', 20, '2026-03-16 08:51:06'),
(22, 2, 'OUT', 17, '2026-03-16 08:51:16'),
(23, 1, 'OUT', 34, '2026-03-16 08:51:22'),
(24, 1, 'IN', 23, '2026-03-18 05:33:10'),
(25, 2, 'OUT', 8, '2026-03-18 05:41:29'),
(26, 3, 'OUT', 5, '2026-03-18 05:41:33'),
(32, 1, 'IN', 23, '2026-03-18 07:27:00'),
(34, 2, 'IN', 23, '2026-03-18 12:50:33'),
(35, 1, 'IN', 2, '2026-03-18 13:10:24'),
(36, 1, 'IN', 2, '2026-03-18 13:12:09'),
(37, 2, 'IN', 23, '2026-03-18 13:15:09'),
(42, 1, 'IN', 232, '2026-03-18 13:35:21'),
(43, 8, 'IN', 2323, '2026-03-18 13:35:25'),
(44, 8, 'OUT', 2323, '2026-03-18 13:35:29'),
(45, 20, 'OUT', 12, '2026-03-18 13:35:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Inventory_logs`
--
ALTER TABLE `Inventory_logs`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Product_id` (`Product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Inventory_logs`
--
ALTER TABLE `Inventory_logs`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Inventory_logs`
--
ALTER TABLE `Inventory_logs`
  ADD CONSTRAINT `FK_logs_product` FOREIGN KEY (`Product_id`) REFERENCES `Products` (`Products_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
