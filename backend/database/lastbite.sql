-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Bulan Mei 2026 pada 17.00
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lastbite`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `dashboard`
--

CREATE TABLE `dashboard` (
  `dashboardID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `totalsavedfood` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `delivery`
--

CREATE TABLE `delivery` (
  `deliverID` int(11) NOT NULL,
  `orderID` int(11) NOT NULL,
  `method` varchar(50) NOT NULL,
  `shipping_status` varchar(50) DEFAULT 'Pending',
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `order`
--

CREATE TABLE `order` (
  `orderID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_item`
--

CREATE TABLE `order_item` (
  `orderItemID` int(11) NOT NULL,
  `orderID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE `product` (
  `productID` int(11) NOT NULL,
  `sellerID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT 'default_food.png',
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `original_price` int(11) DEFAULT 0,
  `price` int(11) DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) DEFAULT 'available',
  `expiryTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `product`
--

INSERT INTO `product` (`productID`, `sellerID`, `name`, `image`, `category`, `description`, `original_price`, `price`, `stock`, `status`, `expiryTime`) VALUES
(1, 101, 'Bakery Surprise Box', 'default_food.png', 'Bakery', '3-4 pieces of sweet and savory pastries from today\'s display. Quality guaranteed!', 50000, 25000, 29, 'active', '2027-12-31 21:00:00'),
(2, 101, 'Sourdough & Baguette', 'default_food.png', 'Bakery', 'Artisan bread bundle. Perfect for tomorrow\'s breakfast.', 50000, 25000, 3, 'active', '2027-12-31 22:00:00'),
(3, 102, 'Vegan Starter Pack', 'default_food.png', 'Vegan', 'A mystery box containing 2 plant-based meals (salad or wrap). 100% cruelty-free.', 70000, 35000, 4, 'active', '2027-12-31 20:00:00'),
(4, 103, 'Dairy Rescue Bundle', 'default_food.png', 'Dairy', 'Fresh milk and yogurt nearing their optimal selling limit. Refrigerate immediately!', 40000, 20000, 6, 'active', '2027-12-31 18:00:00'),
(5, 104, 'Sushi Roll Roulette', 'default_food.png', 'Seafood', 'Contains 2 portions of cooked/baked sushi rolls. No raw sashimi for safety reasons.', 80000, 40000, 2, 'active', '2027-12-31 21:30:00'),
(6, 105, 'Indonesian Comfort Box', 'default_food.png', 'Local', 'A surprise mix of traditional Indonesian dishes and rice. Big portions, great taste!', 40000, 20000, 10, 'active', '2027-12-31 19:00:00'),
(7, 106, 'Midnight Sugar Rush', 'default_food.png', 'Dessert', 'Today\'s surplus of premium cupcakes or cake slices. Perfect for your late-night cravings.', 60000, 30000, 3, 'active', '2027-12-31 23:00:00'),
(8, 107, 'Healthy Bowl Surplus', 'default_food.png', 'Vegan', 'Organic veggies, dressings, and plant-based proteins. Stay healthy on a budget.', 70000, 35000, 5, 'active', '2027-12-31 20:30:00'),
(9, 108, 'Pasta Fresca Box', 'default_food.png', 'Italian', 'Authentic Italian pasta surplus. Just heat it up in the microwave and enjoy!', 60000, 30000, 4, 'active', '2027-12-31 21:00:00'),
(10, 109, 'Spicy Challenge Box', 'default_food.png', 'Spicy', 'Random spicy chicken meals with surprise heat levels. Dare to try?', 60000, 30000, 8, 'active', '2027-12-31 22:00:00'),
(11, 110, 'Pastry & Brew Box', 'default_food.png', 'Beverage', '1 liter of milk coffee + 2 pastries that missed the aesthetic check but still taste amazing.', 60000, 30000, 7, 'active', '2027-12-31 23:59:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `report`
--

CREATE TABLE `report` (
  `reportID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `sellerID` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `role`
--

CREATE TABLE `role` (
  `roleID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `role`
--

INSERT INTO `role` (`roleID`, `name`) VALUES
(1, 'buyer'),
(2, 'seller'),
(3, 'admin');

-- --------------------------------------------------------

--
-- Struktur dari tabel `timer`
--

CREATE TABLE `timer` (
  `timerID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `countdown` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `roleID` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) NOT NULL,
  `fcm_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`userID`, `roleID`, `full_name`, `birth_date`, `password`, `address`, `created_at`, `email`, `fcm_token`) VALUES
(1, 1, 'Budi Beli', '2002-10-15', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Jl. Mawar No. 123, Bandung', '2026-05-28 12:54:49', 'budi@gmail.com', NULL),
(99, 3, 'Admin LastBite', '2000-01-01', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'LastBite', '2026-05-19 16:36:44', 'admin@lastbite.com', NULL),
(101, 2, 'Majesty Bakery', '2010-01-01', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Sudirman Street No. 1', '2026-05-28 11:42:18', 'hello@majesty.com', NULL),
(102, 2, 'Vegan Vibe', '2015-05-12', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Kemang Raya Avenue 12', '2026-05-28 11:42:18', 'admin@veganvibe.com', NULL),
(103, 2, 'Moo Moo Dairy', '2018-03-22', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Asia Afrika Street', '2026-05-28 11:42:18', 'moo@dairy.com', NULL),
(104, 2, 'Sushi Surplus', '2012-11-10', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'PIK Avenue Boulevard', '2026-05-28 11:42:18', 'info@sushisurplus.com', NULL),
(105, 2, 'Archipelago Eats', '2005-08-17', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Gatot Subroto Street', '2026-05-28 11:42:18', 'admin@archipelago.com', NULL),
(106, 2, 'Sweet Tooth Dessert', '2020-02-14', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Grand Indonesia Mall', '2026-05-28 11:42:18', 'sweet@tooth.com', NULL),
(107, 2, 'Green Bowl Salad', '2019-07-07', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Senopati Street No 8', '2026-05-28 11:42:18', 'green@bowl.com', NULL),
(108, 2, 'Pasta La Vista', '2014-10-31', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Braga Street', '2026-05-28 11:42:18', 'pasta@vista.com', NULL),
(109, 2, 'Spicy Bites', '2016-09-09', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Campus Square', '2026-05-28 11:42:18', 'hello@spicybites.com', NULL),
(110, 2, 'Twilight Roasters', '2021-04-01', '$2b$10$R9h/cIP5b9WnVGLS67WhFeXg8Kj3K6N/zWdfM2B7tG2Nl7qH6A6by', 'Canggu, Bali', '2026-05-28 11:42:18', 'hello@twilightroasters.com', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`dashboardID`),
  ADD KEY `userID` (`userID`);

--
-- Indeks untuk tabel `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`deliverID`),
  ADD KEY `orderID` (`orderID`);

--
-- Indeks untuk tabel `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `userID` (`userID`);

--
-- Indeks untuk tabel `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`orderItemID`),
  ADD KEY `orderID` (`orderID`),
  ADD KEY `productID` (`productID`);

--
-- Indeks untuk tabel `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `sellerID` (`sellerID`);

--
-- Indeks untuk tabel `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `sellerID` (`sellerID`);

--
-- Indeks untuk tabel `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleID`);

--
-- Indeks untuk tabel `timer`
--
ALTER TABLE `timer`
  ADD PRIMARY KEY (`timerID`),
  ADD KEY `productID` (`productID`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `roleID` (`roleID`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `dashboardID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `delivery`
--
ALTER TABLE `delivery`
  MODIFY `deliverID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `order`
--
ALTER TABLE `order`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `order_item`
--
ALTER TABLE `order_item`
  MODIFY `orderItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `report`
--
ALTER TABLE `report`
  MODIFY `reportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `role`
--
ALTER TABLE `role`
  MODIFY `roleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `timer`
--
ALTER TABLE `timer`
  MODIFY `timerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `dashboard_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `order` (`orderID`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Ketidakleluasaan untuk tabel `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `order` (`orderID`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`sellerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`sellerID`) REFERENCES `user` (`userID`);

--
-- Ketidakleluasaan untuk tabel `timer`
--
ALTER TABLE `timer`
  ADD CONSTRAINT `timer_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `role` (`roleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
