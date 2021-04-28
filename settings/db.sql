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
	/* 0: normal, 1: manager, 2: admin */
	`Permission` INT(11) NOT NULL,
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
	`IPAddress` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
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
	`Language` CHAR(20),
	`Uploader` CHAR(255),
	`Published` TIMESTAMP NULL DEFAULT NULL,
	`Files` INT(11),
	`Class` VARCHAR(256),
	`ExistOnHitomi` INT(11),
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `eharticles_TypeIndex` (`Type`) USING BTREE,
	INDEX `eharticles_LanguageIndex` (`Language`) USING BTREE,
	FULLTEXT `eharticles_TitleIndex` (title)
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `permission` (
	`User` INT(11) NOT NULL,
	PRIMARY KEY (`User`) USING BTREE,
	INDEX `permission_User_Index` (`User`) USING BTREE,
	CONSTRAINT `permission_UserForeign` FOREIGN KEY (`User`) REFERENCES `violet`.`user` (`Pid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

/*---------------------------------------------------

			article junction tables

---------------------------------------------------*/

CREATE TABLE `article_article_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_articleArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_articleJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_article_junction_index` (`Article`) USING BTREE,
	INDEX `article_article_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `article_eharticle_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_eharticleArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_eharticleJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_eharticle_junction_index` (`Article`) USING BTREE,
	INDEX `article_eharticle_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `article_artist_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_artistArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_artistJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_artists` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_artist_junction_index` (`Article`) USING BTREE,
	INDEX `article_artist_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `article_group_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_groupArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_groupJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_groups` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_group_junction_index` (`Article`) USING BTREE,
	INDEX `article_group_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `article_character_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_characterArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_characterJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_characters` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_character_junction_index` (`Article`) USING BTREE,
	INDEX `article_character_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `article_series_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_seriesArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_seriesJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_series` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_series_junction_index` (`Article`) USING BTREE,
	INDEX `article_series_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `article_tag_junction` (
	`Article` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Target`),
	CONSTRAINT `article_tagArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`article` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `article_tagJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_tags` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `article_tag_junction_index` (`Article`) USING BTREE,
	INDEX `article_tag_junction_index_vol` (`Target`) USING BTREE
);

/*---------------------------------------------------

			comment junction tables

---------------------------------------------------*/

CREATE TABLE `comment_article_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_articleComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_articleJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_article_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_article_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `comment_eharticle_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_eharticleComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_eharticleJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_eharticle_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_eharticle_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `comment_artist_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_artistComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_artistJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_artists` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_artist_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_artist_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `comment_group_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_groupComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_groupJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_groups` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_group_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_group_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `comment_character_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_characterComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_characterJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_characters` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_character_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_character_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `comment_series_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_seriesComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_seriesJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_series` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_series_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_series_junction_index_vol` (`Target`) USING BTREE
);

CREATE TABLE `comment_tag_junction` (
	`Comment` INT(11) NOT NULL,
	`Target` INT(11) NOT NULL,
	PRIMARY KEY (`Comment`, `Target`),
	CONSTRAINT `comment_tagComment` FOREIGN KEY (`Comment`) REFERENCES `violet`.`comment` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `comment_tagJunction` FOREIGN KEY (`Target`) REFERENCES `violet`.`eharticles_tags` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `comment_tag_junction_index` (`Comment`) USING BTREE,
	INDEX `comment_tag_junction_index_vol` (`Target`) USING BTREE
);

/*---------------------------------------------------

			eharticles junction tables

---------------------------------------------------*/

CREATE TABLE `eharticles_artists` (
	`Id` INT(11) NOT NULL,
	`Name` VARCHAR(256) UNIQUE,
	PRIMARY KEY (`Id`) USING BTREE
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `eharticles_artists_junction` (
	`Article` INT(11) NOT NULL,
	`Artist` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Artist`),
	CONSTRAINT `eharticles_ArtistJunction` FOREIGN KEY (`Artist`) REFERENCES `violet`.`eharticles_artists` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `eharticles_ArtistArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `eharticles_artists_junction_index` (`Article`) USING BTREE,
	INDEX `eharticles_artists_junction_index_vol` (`Artist`) USING BTREE
);

CREATE TABLE `eharticles_characters` (
	`Id` INT(11) NOT NULL,
	`Name` VARCHAR(256) UNIQUE,
	PRIMARY KEY (`Id`) USING BTREE
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `eharticles_characters_junction` (
	`Article` INT(11) NOT NULL,
	`Character` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Character`),
	CONSTRAINT `eharticles_CharacterJunction` FOREIGN KEY (`Character`) REFERENCES `violet`.`eharticles_characters` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `eharticles_CharacterArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `eharticles_characters_junction_index` (`Article`) USING BTREE,
	INDEX `eharticles_characters_junction_index_vol` (`Character`) USING BTREE
);

CREATE TABLE `eharticles_groups` (
	`Id` INT(11) NOT NULL,
	`Name` VARCHAR(256) UNIQUE,
	PRIMARY KEY (`Id`) USING BTREE
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `eharticles_groups_junction` (
	`Article` INT(11) NOT NULL,
	`Group` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Group`),
	CONSTRAINT `eharticles_GroupJunction` FOREIGN KEY (`Group`) REFERENCES `violet`.`eharticles_groups` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `eharticles_GroupArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `eharticles_groups_junction_index` (`Article`) USING BTREE,
	INDEX `eharticles_groups_junction_index_vol` (`Group`) USING BTREE
);

CREATE TABLE `eharticles_series` (
	`Id` INT(11) NOT NULL,
	`Name` VARCHAR(256) UNIQUE,
	PRIMARY KEY (`Id`) USING BTREE
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `eharticles_series_junction` (
	`Article` INT(11) NOT NULL,
	`Series` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Series`),
	CONSTRAINT `eharticles_SeriesJunction` FOREIGN KEY (`Series`) REFERENCES `violet`.`eharticles_series` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `eharticles_SeriesArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `eharticles_series_junction_index` (`Article`) USING BTREE,
	INDEX `eharticles_series_junction_index_vol` (`Series`) USING BTREE
);

CREATE TABLE `eharticles_tags` (
	`Id` INT(11) NOT NULL,
	`Name` VARCHAR(256) UNIQUE,
	PRIMARY KEY (`Id`) USING BTREE
)
CHARSET=utf8mb4
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `eharticles_tags_junction` (
	`Article` INT(11) NOT NULL,
	`Tag` INT(11) NOT NULL,
	PRIMARY KEY (`Article`, `Tag`),
	CONSTRAINT `eharticles_TagJunction` FOREIGN KEY (`Tag`) REFERENCES `violet`.`eharticles_tags` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `eharticles_TagArticle` FOREIGN KEY (`Article`) REFERENCES `violet`.`eharticles` (`Id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	INDEX `eharticles_tags_junction_index` (`Article`) USING BTREE,
	INDEX `eharticles_tags_junction_index_vol` (`Tag`) USING BTREE
);