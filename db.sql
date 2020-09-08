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

CREATE TABLE `article` (
	`Id` INT(11) NOT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`Author` INT(11) NULL DEFAULT NULL,
	`Title` CHAR(50) NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`Body` VARCHAR(5000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `comment` (
	`Id` INT(11) NOT NULL,
	`ArticleId` INT(11) NOT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`Author` INT(11) NULL DEFAULT NULL,
	`Body` VARCHAR(500) NULL DEFAULT '' COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `ArticleId` (`ArticleId`) USING BTREE,
	CONSTRAINT `ArticleId` FOREIGN KEY (`ArticleId`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
