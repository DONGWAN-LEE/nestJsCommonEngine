## 📦 설치 가이드

NestJS 프로젝트를 실행하기 위한 필수 패키지들을 아래 명령어로 한 번에 설치할 수 있습니다.

---

### 🛠️ 1. 전역 NestJS CLI 설치

```bash
# 글로벌 설치 (Nest CLI)
npm install -g @nestjs/cli

# 일반 의존성 설치
npm install \
  @nestjs/platform-express \
  @nestjs/platform-ws \
  @nestjs/platform-socket.io \
  @nestjs/websockets \
  @nestjs/axios \
  @nestjs/config \
  @nestjs/typeorm typeorm \
  @nestjs/cache-manager cache-manager \
  class-validator \
  class-transformer \
  axios \
  dotenv \
  compression \
  cookie-parser \
  request-ip \
  qrcode \
  openai \
  googleapis \
  puppeteer \
  google-play-scraper \
  dayjs \
  emoji-strip \
  glob \
  html-entities \
  badwords-ko \
  mysql \
  ejs \
  bcrypt \
  cache-manager-ioredis \
  nest-winston \
  express \
  @nestjs/testing \
  @supabase/supabase-js

# 개발 의존성 설치
npm install --save-dev \
  @types/socket.io \
  @types/cookie-parser \
  @types/glob \
  @types/express \
  @types/jest \
  nodemon


# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드 및 실행
npm run build
npm run start:prod



```Test_Database_Query (.env 의 ENABLE_DATABASE 가 false 일 경우 아래 쿼리 사용 안해도 무방함.)
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