-- 数据库初始化脚本
drop database parking_system;
CREATE DATABASE IF NOT EXISTS parking_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE parking_system;
-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建车辆表
CREATE TABLE IF NOT EXISTS vehicle (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(20) NOT NULL,
    vehicle_color VARCHAR(20),
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 创建车位表
CREATE TABLE IF NOT EXISTS parking_space (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    space_number VARCHAR(20) NOT NULL UNIQUE,
    space_type VARCHAR(10) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'EMPTY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建停车记录表
CREATE TABLE IF NOT EXISTS parking_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT,
    parking_space_id BIGINT,
    entry_time TIMESTAMP,
    exit_time TIMESTAMP NULL,
    fee DECIMAL(10,2) NULL,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    FOREIGN KEY (parking_space_id) REFERENCES parking_space(id)
);

-- 初始化用户数据（30条）
INSERT INTO user (username, password, role, phone) VALUES
('admin', 'admin123', 'ADMIN', '13800000000'),
('user1', 'password1', 'USER', '13800000001'),
('user2', 'password2', 'USER', '13800000002'),
('user3', 'password3', 'USER', '13800000003'),
('user4', 'password4', 'USER', '13800000004'),
('user5', 'password5', 'USER', '13800000005'),
('user6', 'password6', 'USER', '13800000006'),
('user7', 'password7', 'USER', '13800000007'),
('user8', 'password8', 'USER', '13800000008'),
('user9', 'password9', 'USER', '13800000009'),
('user10', 'password10', 'USER', '13800000010'),
('user11', 'password11', 'USER', '13800000011'),
('user12', 'password12', 'USER', '13800000012'),
('user13', 'password13', 'USER', '13800000013'),
('user14', 'password14', 'USER', '13800000014'),
('user15', 'password15', 'USER', '13800000015'),
('user16', 'password16', 'USER', '13800000016'),
('user17', 'password17', 'USER', '13800000017'),
('user18', 'password18', 'USER', '13800000018'),
('user19', 'password19', 'USER', '13800000019'),
('user20', 'password20', 'USER', '13800000020'),
('user21', 'password21', 'USER', '13800000021'),
('user22', 'password22', 'USER', '13800000022'),
('user23', 'password23', 'USER', '13800000023'),
('user24', 'password24', 'USER', '13800000024'),
('user25', 'password25', 'USER', '13800000025'),
('user26', 'password26', 'USER', '13800000026'),
('user27', 'password27', 'USER', '13800000027'),
('user28', 'password28', 'USER', '13800000028'),
('user29', 'password29', 'USER', '13800000029'),
('user30', 'password30', 'USER', '13800000030');

-- 初始化车辆数据（30条）
INSERT INTO vehicle (license_plate, vehicle_type, vehicle_color, user_id) VALUES
('京A12345', '轿车', '黑色', 1),
('京B12345', 'SUV', '白色', 2),
('京C12345', '货车', '蓝色', 3),
('京A23456', '轿车', '红色', 4),
('京B23456', 'SUV', '灰色', 5),
('京C23456', '货车', '黄色', 6),
('京A34567', '轿车', '黑色', 7),
('京B34567', 'SUV', '白色', 8),
('京C34567', '货车', '蓝色', 9),
('京A45678', '轿车', '红色', 10),
('京B45678', 'SUV', '灰色', 11),
('京C45678', '货车', '黄色', 12),
('京A56789', '轿车', '黑色', 13),
('京B56789', 'SUV', '白色', 14),
('京C56789', '货车', '蓝色', 15),
('京A67890', '轿车', '红色', 16),
('京B67890', 'SUV', '灰色', 17),
('京C67890', '货车', '黄色', 18),
('京A78901', '轿车', '黑色', 19),
('京B78901', 'SUV', '白色', 20),
('京C78901', '货车', '蓝色', 21),
('京A89012', '轿车', '红色', 22),
('京B89012', 'SUV', '灰色', 23),
('京C89012', '货车', '黄色', 24),
('京A90123', '轿车', '黑色', 25),
('京B90123', 'SUV', '白色', 26),
('京C90123', '货车', '蓝色', 27),
('京A01234', '轿车', '红色', 28),
('京B01234', 'SUV', '灰色', 29),
('京C01234', '货车', '黄色', 30);

-- 初始化车位数据（30条）
INSERT INTO parking_space (space_number, space_type, status) VALUES
('A001', 'A', 'EMPTY'),
('A002', 'A', 'EMPTY'),
('A003', 'A', 'EMPTY'),
('A004', 'A', 'EMPTY'),
('A005', 'A', 'EMPTY'),
('A006', 'A', 'EMPTY'),
('A007', 'A', 'EMPTY'),
('A008', 'A', 'EMPTY'),
('A009', 'A', 'EMPTY'),
('A010', 'A', 'EMPTY'),
('B001', 'B', 'EMPTY'),
('B002', 'B', 'EMPTY'),
('B003', 'B', 'EMPTY'),
('B004', 'B', 'EMPTY'),
('B005', 'B', 'EMPTY'),
('B006', 'B', 'EMPTY'),
('B007', 'B', 'EMPTY'),
('B008', 'B', 'EMPTY'),
('B009', 'B', 'EMPTY'),
('B010', 'B', 'EMPTY'),
('C001', 'C', 'EMPTY'),
('C002', 'C', 'EMPTY'),
('C003', 'C', 'EMPTY'),
('C004', 'C', 'EMPTY'),
('C005', 'C', 'EMPTY'),
('C006', 'C', 'EMPTY'),
('C007', 'C', 'EMPTY'),
('C008', 'C', 'EMPTY'),
('C009', 'C', 'EMPTY'),
('C010', 'C', 'EMPTY');

-- 初始化停车记录数据（30条）
INSERT INTO parking_record (vehicle_id, parking_space_id, entry_time, exit_time, fee, status) VALUES
(1, 1, '2025-04-01 08:00:00', '2025-04-01 10:00:00', 10.00, 'COMPLETED'),
(2, 11, '2025-04-01 09:00:00', '2025-04-01 12:00:00', 24.00, 'COMPLETED'),
(3, 21, '2025-04-01 10:00:00', '2025-04-01 14:00:00', 60.00, 'COMPLETED'),
(4, 2, '2025-04-02 08:00:00', '2025-04-02 10:00:00', 10.00, 'COMPLETED'),
(5, 12, '2025-04-02 09:00:00', '2025-04-02 12:00:00', 24.00, 'COMPLETED'),
(6, 22, '2025-04-02 10:00:00', '2025-04-02 14:00:00', 60.00, 'COMPLETED'),
(7, 3, '2025-04-03 08:00:00', '2025-04-03 10:00:00', 10.00, 'COMPLETED'),
(8, 13, '2025-04-03 09:00:00', '2025-04-03 12:00:00', 24.00, 'COMPLETED'),
(9, 23, '2025-04-03 10:00:00', '2025-04-03 14:00:00', 60.00, 'COMPLETED'),
(10, 4, '2025-04-04 08:00:00', '2025-04-04 10:00:00', 10.00, 'COMPLETED'),
(11, 14, '2025-04-04 09:00:00', '2025-04-04 12:00:00', 24.00, 'COMPLETED'),
(12, 24, '2025-04-04 10:00:00', '2025-04-04 14:00:00', 60.00, 'COMPLETED'),
(13, 5, '2025-04-05 08:00:00', '2025-04-05 10:00:00', 10.00, 'COMPLETED'),
(14, 15, '2025-04-05 09:00:00', '2025-04-05 12:00:00', 24.00, 'COMPLETED'),
(15, 25, '2025-04-05 10:00:00', '2025-04-05 14:00:00', 60.00, 'COMPLETED'),
(16, 6, '2025-04-06 08:00:00', '2025-04-06 10:00:00', 10.00, 'COMPLETED'),
(17, 16, '2025-04-06 09:00:00', '2025-04-06 12:00:00', 24.00, 'COMPLETED'),
(18, 26, '2025-04-06 10:00:00', '2025-04-06 14:00:00', 60.00, 'COMPLETED'),
(19, 7, '2025-04-07 08:00:00', '2025-04-07 10:00:00', 10.00, 'COMPLETED'),
(20, 17, '2025-04-07 09:00:00', '2025-04-07 12:00:00', 24.00, 'COMPLETED'),
(21, 27, '2025-04-07 10:00:00', '2025-04-07 14:00:00', 60.00, 'COMPLETED'),
(22, 8, '2025-04-08 08:00:00', NULL, NULL, 'IN_PROGRESS'),
(23, 18, '2025-04-08 09:00:00', NULL, NULL, 'IN_PROGRESS'),
(24, 28, '2025-04-08 10:00:00', NULL, NULL, 'IN_PROGRESS'),
(25, 9, '2025-04-08 11:00:00', NULL, NULL, 'IN_PROGRESS'),
(26, 19, '2025-04-08 12:00:00', NULL, NULL, 'IN_PROGRESS'),
(27, 29, '2025-04-08 13:00:00', NULL, NULL, 'IN_PROGRESS'),
(28, 10, '2025-04-08 14:00:00', NULL, NULL, 'IN_PROGRESS'),
(29, 20, '2025-04-08 15:00:00', NULL, NULL, 'IN_PROGRESS'),
(30, 30, '2025-04-08 16:00:00', NULL, NULL, 'IN_PROGRESS');
