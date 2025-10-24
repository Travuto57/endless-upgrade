CREATE TABLE `giveawayEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`nflTeam` varchar(100) NOT NULL,
	`clickedSurvey` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `giveawayEntries_id` PRIMARY KEY(`id`)
);
