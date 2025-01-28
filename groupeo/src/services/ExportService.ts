import PDFDocument from 'pdfkit';
import { GroupeService } from './GroupeService';
import { SousGroupeService } from './SousGroupeService';
import { PaiementService } from './PaiementService';
import { Etudiant, PaiementEffectue, StatutPaiement } from '../models';
import fs from 'fs';

export class ExportService {
    constructor(
        private groupeService: GroupeService,
        private sousGroupeService: SousGroupeService,
        private paiementService: PaiementService
    ) {}

    async exportGroupeEtudiants(groupeId: number, outputPath: string): Promise<boolean> {
        try {
            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            // Récupérer les informations du groupe
            const groupe = await this.groupeService.findWithRelations(groupeId);
            if (!groupe) return false;

            // En-tête
            doc.fontSize(16).text(`Liste des étudiants - ${groupe.nomGroupe}`, { align: 'center' });
            doc.moveDown();

            // Pour chaque sous-groupe
            for (const sousGroupe of groupe.sousGroupes || []) {
                doc.fontSize(14).text(`Sous-groupe: ${sousGroupe.nomSousGroupe}`);
                doc.moveDown();

                // Récupérer les étudiants du sous-groupe
                const etudiants = await this.sousGroupeService.getEtudiants(sousGroupe.idSousGroupe);

                // Tableau des étudiants
                this.drawEtudiantsTable(doc, etudiants);
                doc.moveDown(2);
            }

            doc.end();
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            return false;
        }
    }

    async exportPaiementStatus(paiementId: number, outputPath: string): Promise<boolean> {
        try {
            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            const paiement = await this.paiementService.findById(paiementId);
            if (!paiement) return false;

            // En-tête
            doc.fontSize(16).text(`État des paiements - ${paiement.nomPaiement}`, { align: 'center' });
            doc.moveDown();

            // Étudiants ayant payé
            doc.fontSize(14).text('Étudiants ayant effectué le paiement:');
            doc.moveDown();
            const paiementsEffectues = await this.paiementService.findWithRelations(paiementId);
            const etudiantsAyantPaye = paiementsEffectues?.paiementsEffectues?.filter(
                p => p.statut === StatutPaiement.VALIDE
            ) || [];
            
            this.drawPaiementsTable(doc, etudiantsAyantPaye);
            doc.moveDown(2);

            doc.end();
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            return false;
        }
    }

    private drawEtudiantsTable(doc: PDFKit.PDFDocument, etudiants: Etudiant[]): void {
        const tableTop = doc.y;
        const columns = {
            matricule: { x: 50, width: 100 },
            nom: { x: 150, width: 200 }
        };

        // En-têtes
        doc.fontSize(12)
            .text('Matricule', columns.matricule.x, tableTop)
            .text('Nom', columns.nom.x, tableTop);

        let y = tableTop + 20;

        // Lignes
        etudiants.forEach(etudiant => {
            doc.fontSize(10)
                .text(etudiant.matricule, columns.matricule.x, y)
                .text(etudiant.nom, columns.nom.x, y);
            y += 20;
        });
    }

    private drawPaiementsTable(doc: PDFKit.PDFDocument, paiements: PaiementEffectue[]): void {
        const tableTop = doc.y;
        const columns = {
            matricule: { x: 50, width: 100 },
            montant: { x: 150, width: 100 },
            date: { x: 250, width: 150 }
        };

        // En-têtes
        doc.fontSize(12)
            .text('Matricule', columns.matricule.x, tableTop)
            .text('Montant', columns.montant.x, tableTop)
            .text('Date', columns.date.x, tableTop);

        let y = tableTop + 20;

        // Lignes
        paiements.forEach(paiement => {
            doc.fontSize(10)
                .text(paiement.etudiantMatricule || '', columns.matricule.x, y)
                .text(paiement.montantPaye.toString(), columns.montant.x, y)
                .text(new Date(paiement.date || '').toLocaleDateString(), columns.date.x, y);
            y += 20;
        });
    }
} 