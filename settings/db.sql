/* Violet Server Database Create Tables SQL */
/* for MySQL(MariaDB) */

CREATE TABLE `viewtotal` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`ArticleId` INT(11) NULL DEFAULT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`UserAppId` CHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `AritcleId` (`ArticleId`) USING BTREE,
	FULLTEXT INDEX `UserAppId` (`UserAppId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `viewtime` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`ArticleId` INT(11) NULL DEFAULT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`ViewSeconds` INT(11) NULL DEFAULT NULL,
	`UserAppId` CHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `AritcleId` (`ArticleId`) USING BTREE,
	FULLTEXT INDEX `UserAppId` (`UserAppId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `user` (
	`Pid` INT(11) NOT NULL AUTO_INCREMENT,
	`Id` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`Password` VARCHAR(150) NOT NULL COLLATE 'utf8_general_ci',
	`UserAppId` VARCHAR(150) NOT NULL COLLATE 'utf8_general_ci',
	`NickName` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`Etc` VARCHAR(150) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Pid`) USING BTREE,
	FULLTEXT INDEX `Id` (`Id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `board` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`ShortName` CHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`Name` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`Description` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	FULLTEXT INDEX `ShortName` (`ShortName`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `article` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`User` INT(11) NOT NULL,
	`Comments` INT(10) UNSIGNED NOT NULL DEFAULT 0,
	`Title` CHAR(50) NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`Body` VARCHAR(5000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Etc` VARCHAR(5000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Board` INT(11) NOT NULL,
	`View` INT(11) NOT NULL DEFAULT 0,
	`UpVote` INT(11) NOT NULL DEFAULT 0,
	`DownVote` INT(11) NOT NULL DEFAULT 0,
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `Board` (`Board`) USING BTREE,
	CONSTRAINT `Board` FOREIGN KEY (`Board`) REFERENCES `violet`.`board` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `User` FOREIGN KEY (`User`) REFERENCES `violet`.`user` (`Pid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `voterecord` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`User` INT(11) NOT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`Article`  INT(11) NOT NULL,
	/* 0: up, 1: down */
	`Status` INT(11) NOT NULL DEFAULT 0,
	PRIMARY KEY (`Id`) USING BTREE,
	CONSTRAINT `VoteReffer` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `vote_UserForeign` FOREIGN KEY (`User`) REFERENCES `violet`.`user` (`Pid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `comment` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`ArticleId` INT(11) NOT NULL,
	`User` INT(11) NOT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`Body` VARCHAR(500) NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`Parent` INT(11) DEFAULT NULL,
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `ArticleId` (`ArticleId`) USING BTREE,
    UNIQUE KEY `comment_id_UNIQUE` (`Id`),
	CONSTRAINT `ArticleId` FOREIGN KEY (`ArticleId`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `UserId` FOREIGN KEY (`User`) REFERENCES `violet`.`user` (`Pid`) ON UPDATE RESTRICT ON DELETE RESTRICT,
  	CONSTRAINT `SelfKey` FOREIGN KEY (`Parent`) REFERENCES `comment` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `loginrecord` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`UserId` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`Password` VARCHAR(150) NOT NULL COLLATE 'utf8_general_ci',
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`Status` INT(11) NOT NULL,
	PRIMARY KEY (`Id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `usertokens` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`User` INT(11) NOT NULL,
	/* 0: fcm, 1: google, 2: kakao, 3: facebook etc... */
	`TokenType` INT(11) NOT NULL,
	`Token` VARCHAR(256) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `usertokens_User_Index` (`User`) USING BTREE,
	CONSTRAINT `usertokens_UserForeign` FOREIGN KEY (`User`) REFERENCES `violet`.`user` (`Pid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `eharticles` (
	`Id` INT(11) NOT NULL,
	`Title` VARCHAR(5000),
	`EHash` CHAR(20),
	`Type` CHAR(20),
	`Artists` TEXT(65535),
	`Characters` TEXT(65535),
	`Groups` TEXT(65535),
	`Language` CHAR(20),
	`Series` TEXT(65535),
	`Tags` TEXT(65535),
	`Uploader` CHAR(255),
	`Published` TIMESTAMP NULL DEFAULT NULL,
	`Files` INT(11),
	`Class` VARCHAR(256),
	`ExistOnHitomi` INT(11),
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `eharticles_TypeIndex` (`Type`) USING BTREE,
	INDEX `eharticles_LanguageIndex` (`Language`) USING BTREE
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
