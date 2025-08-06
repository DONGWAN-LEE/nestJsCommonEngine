const readmeContent = `
# 🚀 NestJS 프로젝트 설치 가이드

NestJS 기반 프로젝트를 실행하기 위해 필요한 패키지 설치 및 데이터베이스 테스트 방법을 안내합니다.

---

## 📦 패키지 설치

### 🛠️ 1. 전역 NestJS CLI 설치

```bash
npm install -g @nestjs/cli
```

---

### 📁 2. 일반 의존성 설치

```bash
npm install 
  @nestjs/platform-express 
  @nestjs/platform-ws 
  @nestjs/platform-socket.io 
  @nestjs/websockets 
  @nestjs/axios 
  @nestjs/config 
  @nestjs/typeorm typeorm 
  @nestjs/cache-manager cache-manager 
  class-validator 
  class-transformer 
  axios 
  dotenv 
  compression 
  cookie-parser 
  request-ip 
  qrcode 
  openai 
  googleapis 
  puppeteer 
  google-play-scraper 
  dayjs 
  emoji-strip 
  glob 
  html-entities 
  badwords-ko 
  mysql 
  ejs 
  bcrypt 
  cache-manager-ioredis 
  nest-winston 
  express 
  @nestjs/testing 
  @supabase/supabase-js
```

---

### 🧪 3. 개발 의존성 설치

```bash
npm install --save-dev 
  @types/socket.io 
  @types/cookie-parser 
  @types/glob 
  @types/express 
  @types/jest 
  nodemon
```

---

### 🚀 4. 실행 명령어

```bash
# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드 및 실행
npm run build
npm run start:prod
```

---

## 🛠️ Database 연동 시 생성 쿼리

> `.env`의 `ENABLE_DATABASE=false`일 경우 아래 쿼리는 실행하지 않아도 됩니다.

```sql
-- 데이터베이스 생성
CREATE DATABASE `master` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard0` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard1` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard2` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
CREATE DATABASE `shard3` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;

-- 마스터 테이블 생성
CREATE TABLE `master`.`test` (
  `idx` INT AUTO_INCREMENT PRIMARY KEY,
  `test_idx` INT NOT NULL,
  `test_text` VARCHAR(255) NOT NULL,
  `Createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샤드 테이블 생성
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

-- 테스트 데이터 삽입
INSERT INTO `master`.`test` (test_idx, test_text, Createtime)
VALUES (1, 'master_table connect!', NOW());

INSERT INTO `shard0`.`user_test` (user_idx, user_text, Createtime)
VALUES (1, 'user 0 table connect!', NOW());

INSERT INTO `shard1`.`user_test` (user_idx, user_text, Createtime)
VALUES (1, 'user 1 table connect!', NOW());

INSERT INTO `shard2`.`user_test` (user_idx, user_text, Createtime)
VALUES (1, 'user 2 table connect!', NOW());

INSERT INTO `shard3`.`user_test` (user_idx, user_text, Createtime)
VALUES (1, 'user 3 table connect!', NOW());
```

---

### 🔗 Shard Database 연동 테스트

```text
http://localhost:3000/v1_0_0/user/DatabaseConnectTest/:is_shard
```

해당 URL로 접속 시 샤딩된 데이터베이스 연결 테스트가 가능합니다.
Shard 기능이 on 이면 
http://localhost:3000/v1_0_0/user/DatabaseConnectTest/true
off 면
http://localhost:3000/v1_0_0/user/DatabaseConnectTest/false

---