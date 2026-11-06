-- PulseDesk schema for local Docker (MySQL 8.4).
-- Generated from the EF Core model (AppDbContext) with:
--   cd services/api/PulseDesk && dotnet ef dbcontext script -o ../db/init.sql
-- (Design time needs a reachable MySQL, because Program.cs calls ServerVersion.AutoDetect.)
-- The API has no EF migrations yet, so this file is the schema source for compose.
-- MySQL runs it once, on the first start of an empty data volume.
-- Regenerate it when the model changes; W1-1 replaces it with EF migrations.

ALTER DATABASE CHARACTER SET utf8mb4;


CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FullName` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Role` longtext CHARACTER SET utf8mb4 NOT NULL DEFAULT ('Customer'),
    `CreatedAt` datetime(6) NOT NULL,
    `IsActive` tinyint(1) NOT NULL DEFAULT TRUE,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;


CREATE TABLE `Tickets` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Title` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Status` longtext CHARACTER SET utf8mb4 NOT NULL DEFAULT ('Open'),
    `Priority` longtext CHARACTER SET utf8mb4 NOT NULL DEFAULT ('Medium'),
    `CustomerId` int NOT NULL,
    `AgentId` int NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Tickets` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Tickets_Users_AgentId` FOREIGN KEY (`AgentId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Tickets_Users_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;


CREATE TABLE `AuditLogs` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FieldName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `TicketId` int NOT NULL,
    `ChangedByUserId` int NOT NULL,
    `OldValue` longtext CHARACTER SET utf8mb4 NOT NULL,
    `NewValue` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ChangedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_AuditLogs` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AuditLogs_Tickets_TicketId` FOREIGN KEY (`TicketId`) REFERENCES `Tickets` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AuditLogs_Users_ChangedByUserId` FOREIGN KEY (`ChangedByUserId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;


CREATE TABLE `Comments` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `TicketId` int NOT NULL,
    `UserId` int NOT NULL,
    `Body` longtext CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `ChangedByUserId` int NOT NULL,
    CONSTRAINT `PK_Comments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Comments_Tickets_TicketId` FOREIGN KEY (`TicketId`) REFERENCES `Tickets` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Comments_Users_ChangedByUserId` FOREIGN KEY (`ChangedByUserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Comments_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;


CREATE INDEX `IX_AuditLogs_ChangedByUserId` ON `AuditLogs` (`ChangedByUserId`);


CREATE INDEX `IX_AuditLogs_TicketId` ON `AuditLogs` (`TicketId`);


CREATE INDEX `IX_Comments_ChangedByUserId` ON `Comments` (`ChangedByUserId`);


CREATE INDEX `IX_Comments_TicketId` ON `Comments` (`TicketId`);


CREATE INDEX `IX_Comments_UserId` ON `Comments` (`UserId`);


CREATE INDEX `IX_Tickets_AgentId` ON `Tickets` (`AgentId`);


CREATE INDEX `IX_Tickets_CustomerId` ON `Tickets` (`CustomerId`);


CREATE UNIQUE INDEX `IX_Users_Email` ON `Users` (`Email`);


