-- CreateTable
CREATE TABLE `Professional` (
    `id` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `domicilio` VARCHAR(191) NOT NULL,
    `localidadId` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',

    UNIQUE INDEX `Professional_matricula_key`(`matricula`),
    UNIQUE INDEX `Professional_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObraSocial` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ObraSocial_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfessionalObraSocial` (
    `id` VARCHAR(191) NOT NULL,
    `professionalId` VARCHAR(191) NOT NULL,
    `obraSocialId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProfessionalObraSocial_professionalId_obraSocialId_key`(`professionalId`, `obraSocialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Practice` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `obraSocialId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Localidad` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Localidad_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` VARCHAR(191) NOT NULL,
    `professionalId` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Enrollment_professionalId_year_month_kind_key`(`professionalId`, `year`, `month`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` VARCHAR(191) NOT NULL,
    `professionalId` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Document_professionalId_kind_key`(`professionalId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Professional` ADD CONSTRAINT `Professional_localidadId_fkey` FOREIGN KEY (`localidadId`) REFERENCES `Localidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfessionalObraSocial` ADD CONSTRAINT `ProfessionalObraSocial_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `Professional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfessionalObraSocial` ADD CONSTRAINT `ProfessionalObraSocial_obraSocialId_fkey` FOREIGN KEY (`obraSocialId`) REFERENCES `ObraSocial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Practice` ADD CONSTRAINT `Practice_obraSocialId_fkey` FOREIGN KEY (`obraSocialId`) REFERENCES `ObraSocial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `Professional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `Professional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
