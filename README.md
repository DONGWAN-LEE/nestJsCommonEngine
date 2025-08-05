## 📦 설치 가이드

NestJS 프로젝트를 실행하기 위한 필수 패키지들을 아래 명령어로 한 번에 설치할 수 있습니다.

---

### 🛠️ 1. 전역 NestJS CLI 설치

```bash
npm install -g @nestjs/cli
npm install @nestjs/platform-express
npm install @nestjs/platform-ws
npm install @nestjs/platform-socket.io
npm install @nestjs/websockets
npm install @nestjs/axios
npm install @nestjs/config
npm install @nestjs/typeorm typeorm
npm install @nestjs/cache-manager cache-manager
npm install class-validator
npm install class-transformer
npm install axios
npm install dotenv
npm install compression
npm install cookie-parser
npm install request-ip
npm install qrcode
npm install openai
npm install googleapis
npm install puppeteer
npm install google-play-scraper
npm install dayjs
npm install emoji-strip
npm install glob
npm install html-entities
npm install badwords-ko
npm install mysql
npm install ejs
npm install bcrypt
npm install cache-manager-ioredis
npm install nest-winston
npm install express
npm install --save-dev @types/socket.io
npm install --save-dev @types/cookie-parser
npm install --save-dev @types/glob
npm install --save-dev @types/express
npm install --save-dev nodemon
npm install @nestjs/testing
npm install --save-dev @types/jest
npm install @supabase/supabase-js
npm install request-ip
npm install qrcode
npm install cookie-parser

# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드 및 실행
npm run build
npm run start:prod



```Test_Database_Query
CREATE DATABASE `master` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard0` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard1` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard2` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard3` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;

CREATE TABLE `master`.`test` (
    `idx` INT AUTO_INCREMENT PRIMARY KEY,
    `test_idx` INT NOT NULL,
    `test_text` VARCHAR(255) NOT NULL,
    `Createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `shard0`.`user_test` (
    `idx` INT AUTO_INCREMENT PRIMARY KEY,
    `user_idx` INT NOT NULL,
    `user_text` VARCHAR(255) NOT NULL,
    `Createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `shard1`.`user_test` (
    `idx` INT AUTO_INCREMENT PRIMARY KEY,
    `user_idx` INT NOT NULL,
    `user_text` VARCHAR(255) NOT NULL,
    `Createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `shard2`.`user_test` (
    `idx` INT AUTO_INCREMENT PRIMARY KEY,
    `user_idx` INT NOT NULL,
    `user_text` VARCHAR(255) NOT NULL,
    `Createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `shard3`.`user_test` (
    `idx` INT AUTO_INCREMENT PRIMARY KEY,
    `user_idx` INT NOT NULL,
    `user_text` VARCHAR(255) NOT NULL,
    `Createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `master`.`test` (test_idx, test_text, Createtime) VALUES(1, 'master_table connect!', NOW());
INSERT INTO `shard0`.`user_test` (user_idx, user_text, Createtime) VALUES(1, 'user 0 table connect!', NOW());
INSERT INTO `shard1`.`user_test` (user_idx, user_text, Createtime) VALUES(1, 'user 1 table connect!', NOW());
INSERT INTO `shard2`.`user_test` (user_idx, user_text, Createtime) VALUES(1, 'user 2 table connect!', NOW());
INSERT INTO `shard3`.`user_test` (user_idx, user_text, Createtime) VALUES(1, 'user 3 table connect!', NOW());

# Shard Database 연동 TEST
http://localhost:3000/v1_0_0/user/DatabaseConnectTest