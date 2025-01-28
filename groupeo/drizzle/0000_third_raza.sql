CREATE TABLE `delegue` (
	`id_delegue` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`date_creation` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `delegue_email_unique` ON `delegue` (`email`);--> statement-breakpoint
CREATE TABLE `etudiants` (
	`id_etudiant` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`matricule` text NOT NULL,
	`nom` text NOT NULL,
	`date_creation` text DEFAULT (current_timestamp),
	`date_modification` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `etudiants_matricule_unique` ON `etudiants` (`matricule`);--> statement-breakpoint
CREATE TABLE `groupes` (
	`id_groupe` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom_groupe` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paiement_effectue` (
	`id_paiement_effectue` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`etudiant_matricule` text,
	`id_paiement` integer,
	`montant_paye` integer NOT NULL,
	`statut` text DEFAULT 'en_attente' NOT NULL,
	`date` text DEFAULT (current_timestamp),
	FOREIGN KEY (`etudiant_matricule`) REFERENCES `etudiants`(`matricule`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`id_paiement`) REFERENCES `paiement`(`id_paiement`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `paiement` (
	`id_paiement` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom_paiement` text NOT NULL,
	`description` text NOT NULL,
	`montant` integer NOT NULL,
	`date_creation` text DEFAULT (current_timestamp),
	`date_modification` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `sous_groupes` (
	`id_sous_groupe` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom_sous_groupe` text NOT NULL,
	`id_groupe` integer NOT NULL,
	FOREIGN KEY (`id_groupe`) REFERENCES `groupes`(`id_groupe`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sous_groupes_etudiants` (
	`id_sous_groupe` integer NOT NULL,
	`matricule` text NOT NULL,
	PRIMARY KEY(`matricule`, `id_sous_groupe`),
	FOREIGN KEY (`id_sous_groupe`) REFERENCES `sous_groupes`(`id_sous_groupe`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`matricule`) REFERENCES `etudiants`(`matricule`) ON UPDATE cascade ON DELETE cascade
);
