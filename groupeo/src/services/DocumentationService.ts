import PDFDocument from 'pdfkit';
import fs from 'fs';

export class DocumentationService {
    async generateDocumentation(outputPath: string): Promise<boolean> {
        try {
            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            // Page de titre
            this.addTitle(doc, "Documentation Technique - Système de Gestion Étudiante");
            
            // Table des matières
            this.addTableOfContents(doc);
            doc.addPage();

            // 1. Présentation du Projet
            this.addSection(doc, "1. Présentation du Projet");
            doc.fontSize(12).text(
                "Application de gestion des étudiants permettant la gestion des groupes, " +
                "sous-groupes et le suivi des paiements. Le système permet aux délégués " +
                "de gérer les cotisations et générer des rapports."
            );
            doc.moveDown(2);

            // 2. Architecture de la Base de Données
            this.addSection(doc, "2. Architecture de la Base de Données");
            this.addDatabaseSchema(doc);
            doc.addPage();

            // 3. Services et Fonctionnalités
            this.addSection(doc, "3. Services et Fonctionnalités");
            this.addServices(doc);
            doc.addPage();

            // 4. Modèles de Données
            this.addSection(doc, "4. Modèles de Données");
            this.addModels(doc);
            doc.addPage();

            // 5. Fonctionnalités Principales
            this.addSection(doc, "5. Fonctionnalités Principales");
            this.addFeatures(doc);

            doc.end();
            return true;
        } catch (error) {
            console.error('Erreur lors de la génération de la documentation:', error);
            return false;
        }
    }

    private addTitle(doc: PDFKit.PDFDocument, title: string): void {
        doc.fontSize(24)
            .text(title, { align: 'center' })
            .moveDown(2);
    }

    private addSection(doc: PDFKit.PDFDocument, title: string): void {
        doc.fontSize(16)
            .text(title, { underline: true })
            .moveDown();
    }

    private addDatabaseSchema(doc: PDFKit.PDFDocument): void {
        const tables = [
            {
                name: "Etudiants",
                fields: [
                    "idEtudiant (PK)",
                    "matricule (Unique)",
                    "nom",
                    "dateCreation",
                    "dateModification"
                ]
            },
            {
                name: "Groupes",
                fields: [
                    "idGroupe (PK)",
                    "nomGroupe",
                    "dateCreation",
                    "dateModification"
                ]
            },
            {
                name: "SousGroupes",
                fields: [
                    "idSousGroupe (PK)",
                    "nomSousGroupe",
                    "groupeId (FK)",
                    "dateCreation",
                    "dateModification"
                ]
            },
            {
                name: "Paiements",
                fields: [
                    "idPaiement (PK)",
                    "nomPaiement",
                    "description",
                    "montant",
                    "dateCreation",
                    "dateModification"
                ]
            },
            {
                name: "PaiementsEffectues",
                fields: [
                    "idPaiementEffectue (PK)",
                    "etudiantMatricule (FK)",
                    "paiementId (FK)",
                    "montantPaye",
                    "statut",
                    "date"
                ]
            }
        ];

        tables.forEach(table => {
            doc.fontSize(14)
                .text(`Table: ${table.name}`, { underline: true })
                .moveDown(0.5);
            
            table.fields.forEach(field => {
                doc.fontSize(12)
                    .text(`• ${field}`, { indent: 20 });
            });
            doc.moveDown();
        });
    }

    private addServices(doc: PDFKit.PDFDocument): void {
        const services = [
            {
                name: "EtudiantService",
                methods: [
                    "findAll(): Liste tous les étudiants",
                    "findById(id): Trouve un étudiant par ID",
                    "findByMatricule(matricule): Trouve par matricule",
                    "create(data): Crée un nouvel étudiant",
                    "update(id, data): Met à jour un étudiant",
                    "delete(id): Supprime un étudiant"
                ]
            },
            {
                name: "PaiementService",
                methods: [
                    "validerPaiement(): Valide un paiement étudiant",
                    "getTotalPaiements(): Calcule le total des paiements",
                    "verifierPaiementEffectue(): Vérifie le statut d'un paiement"
                ]
            },
            {
                name: "DelegueService",
                methods: [
                    "register(): Inscription d'un délégué",
                    "login(): Connexion d'un délégué"
                ]
            }
        ];

        services.forEach(service => {
            doc.fontSize(14)
                .text(service.name, { underline: true })
                .moveDown(0.5);
            
            service.methods.forEach(method => {
                doc.fontSize(12)
                    .text(`• ${method}`, { indent: 20 });
            });
            doc.moveDown();
        });
    }

    private addFeatures(doc: PDFKit.PDFDocument): void {
        const features = [
            "Gestion des étudiants (CRUD)",
            "Organisation en groupes et sous-groupes",
            "Suivi des paiements et cotisations",
            "Génération de rapports PDF",
            "Authentification des délégués",
            "Export des listes d'étudiants",
            "Validation des paiements",
            "Historique des transactions"
        ];

        features.forEach(feature => {
            doc.fontSize(12)
                .text(`• ${feature}`, { indent: 20 });
        });
    }

    private addTableOfContents(doc: PDFKit.PDFDocument): void {
        doc.fontSize(16).text('Table des Matières', { underline: true }).moveDown();
        
        const sections = [
            "1. Présentation du Projet",
            "2. Architecture de la Base de Données",
            "3. Services et Fonctionnalités",
            "4. Modèles de Données",
            "5. Fonctionnalités Principales"
        ];

        sections.forEach(section => {
            doc.fontSize(12).text(section, { indent: 20 });
        });
        doc.moveDown(2);
    }

    private addModels(doc: PDFKit.PDFDocument): void {
        const models = [
            {
                name: "Etudiant",
                properties: [
                    "idEtudiant: number",
                    "matricule: string",
                    "nom: string",
                    "dateCreation: string | null",
                    "dateModification: string | null"
                ]
            },
            {
                name: "Paiement",
                properties: [
                    "idPaiement: number",
                    "nomPaiement: string",
                    "description: string",
                    "montant: number"
                ]
            },
            {
                name: "PaiementEffectue",
                properties: [
                    "idPaiementEffectue: number",
                    "etudiantMatricule: string | null",
                    "paiementId: number | null",
                    "montantPaye: number",
                    "statut: StatutPaiement",
                    "date: string | null"
                ]
            }
        ];

        models.forEach(model => {
            doc.fontSize(14)
                .text(`Interface ${model.name}`, { underline: true })
                .moveDown(0.5);
            
            model.properties.forEach(prop => {
                doc.fontSize(12)
                    .text(`• ${prop}`, { indent: 20 });
            });
            doc.moveDown();
        });
    }
} 