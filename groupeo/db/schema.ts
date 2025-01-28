import { relations, sql } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Table dans la base de données

// Table etudiants
export const EtudiantModel = sqliteTable("etudiants", {
  idEtudiant: int("id_etudiant").primaryKey({ autoIncrement: true }),
  matricule: text("matricule").notNull().unique(),
  nom: text("nom").notNull(),
  dateCreation: text("date_creation").default(sql`(current_timestamp)`),
  dateModification: text("date_modification").default(sql`(current_timestamp)`),
});

// Table groupes
export const GroupeModel = sqliteTable("groupes", {
  idGroupe: int("id_groupe").primaryKey({ autoIncrement: true }),
  nomGroupe: text("nom_groupe").notNull(),
});

// Table sous_groupes
export const SousGroupeModel = sqliteTable("sous_groupes", {
  idSousGroupe: int("id_sous_groupe").primaryKey({ autoIncrement: true }),
  nomSousGroupe: text("nom_sous_groupe").notNull(),
  groupeId: int("id_groupe")
    .notNull()
    .references(() => GroupeModel.idGroupe, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

// Ajout d'un enum pour le statut des paiements
export const StatutPaiement = {
  EN_ATTENTE: 'en_attente',
  VALIDE: 'valide',
  REFUSE: 'refuse'
} as const;

export const PaiementModel = sqliteTable("paiement", {
  idPaiement: int("id_paiement").primaryKey({ autoIncrement: true }),
  nomPaiement: text("nom_paiement").notNull(),
  description: text("description").notNull(),
  montant: int("montant").notNull(),
  dateCreation: text("date_creation").default(sql`(current_timestamp)`),
  dateModification: text("date_modification").default(sql`(current_timestamp)`),
});

export const PaiementEffectueModel = sqliteTable("paiement_effectue", {
  idPaiementEffectue: int("id_paiement_effectue").primaryKey({
    autoIncrement: true,
  }),
  etudiantMatricule: text("etudiant_matricule").references(
    () => EtudiantModel.matricule,
    { onDelete: "cascade", onUpdate: "cascade" }
  ),
  paiementId: int("id_paiement").references(() => PaiementModel.idPaiement, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  montantPaye: int("montant_paye").notNull(),
  statut: text("statut").notNull().default(StatutPaiement.EN_ATTENTE),
  date: text("date").default(sql`(current_timestamp)`),
});

export const DelegueModel = sqliteTable("delegue", {
  idDelegue: int("id_delegue").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  dateCreation: text("date_creation").default(sql`(current_timestamp)`),
});

// Table de liasion entre etudiants et sous_groupes
export const SousGroupesEtudiantsModel = sqliteTable(
    "sous_groupes_etudiants",
    {
      sousGroupeId: int("id_sous_groupe")
        .notNull()
        .references(() => SousGroupeModel.idSousGroupe, {
          onDelete: "cascade",
          onUpdate: "cascade",
        }),
      matricule: text("matricule")
        .notNull()
        .references(() => EtudiantModel.matricule, {
          onDelete: "cascade",
          onUpdate: "cascade",
        }),
    },
    (table) => ([
      primaryKey({columns : [table.matricule,table.sousGroupeId]})
    ])
  );

// Relations entre les tables

// Realtions entre groupes et sousgroupes
export const groupeRelations = relations(GroupeModel,({many})=>({
    sousGroupes : many(SousGroupeModel)
}))

export const sousGroupesRelations = relations(SousGroupeModel,({one,many})=>({
    groupe : one(GroupeModel,{
        fields : [SousGroupeModel.groupeId],
        references : [GroupeModel.idGroupe]
    }),
    etudiants : many(SousGroupesEtudiantsModel)
}))

export const sousGroupesEtudiantsRelations = relations(SousGroupesEtudiantsModel,({one})=>({
    sousGroupe : one(SousGroupeModel,{
        fields : [SousGroupesEtudiantsModel.sousGroupeId],
        references : [SousGroupeModel.idSousGroupe]
    }),
    etudiant : one(EtudiantModel,{
        fields : [SousGroupesEtudiantsModel.matricule],
        references : [EtudiantModel.matricule]
    })
}))

export const paiementRelations = relations(PaiementModel,({many})=>({
    paiementsEffectues : many(PaiementEffectueModel)
}))

export const paiemantEffectuesRelations = relations(PaiementEffectueModel,({one})=>({
    paiement : one(PaiementModel,{
        fields : [PaiementEffectueModel.paiementId],
        references : [PaiementModel.idPaiement]
    }),
    etudiant : one(EtudiantModel,{
        fields : [PaiementEffectueModel.etudiantMatricule],
        references : [EtudiantModel.matricule]
    })
}))





