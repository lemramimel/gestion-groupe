import { BaseService } from './BaseService';
import { Paiement, PaiementWithRelations, PaiementEffectue, StatutPaiement } from '../models';
import { PaiementModel, PaiementEffectueModel } from '@/db/schema';
import { db } from '@/db/database';
import { sql } from 'drizzle-orm';

export class PaiementService extends BaseService<Paiement> {
    protected table = PaiementModel;

    async getTotalPaiements(paiementId: number): Promise<number> {
        const result = await db
            .select({
                total: sql<number>`COALESCE(SUM(${PaiementEffectueModel.montantPaye}), 0)`
            })
            .from(PaiementEffectueModel)
            .where(sql`${PaiementEffectueModel.paiementId} = ${paiementId}`);
        
        return result[0].total;
    }

    async findWithRelations(id: number): Promise<PaiementWithRelations | null> {
        const paiement = await this.findById(id);
        if (!paiement) return null;

        const paiementsEffectues = await db
            .select()
            .from(PaiementEffectueModel)
            .where(sql`${PaiementEffectueModel.paiementId} = ${id}`) as PaiementEffectue[];

        return {
            ...paiement,
            paiementsEffectues
        };
    }

    async validerPaiement(paiementId: number, matricule: string, montantPaye: number): Promise<PaiementEffectue | null> {
        try {
            // Vérifier si le paiement existe
            const paiement = await this.findById(paiementId);
            if (!paiement) {
                throw new Error("Paiement non trouvé");
            }

            // Vérifier si le montant payé est valide
            if (montantPaye <= 0 || montantPaye > paiement.montant) {
                throw new Error("Montant invalide");
            }

            // Créer l'enregistrement du paiement
            const result = await db
                .insert(PaiementEffectueModel)
                .values({
                    paiementId,
                    etudiantMatricule: matricule,
                    montantPaye,
                    statut: StatutPaiement.VALIDE,
                    date: new Date().toISOString()
                })
                .returning() as PaiementEffectue[];

            return result[0];
        } catch (error) {
            console.error('Erreur lors de la validation du paiement:', error);
            return null;
        }
    }

    async getPaiementsEtudiant(matricule: string): Promise<PaiementEffectue[]> {
        const result = await db
            .select()
            .from(PaiementEffectueModel)
            .where(sql`${PaiementEffectueModel.etudiantMatricule} = ${matricule}`)
            .orderBy(sql`${PaiementEffectueModel.date} DESC`) as PaiementEffectue[];

        return result;
    }

    async verifierPaiementEffectue(paiementId: number, matricule: string): Promise<boolean> {
        const result = await db
            .select()
            .from(PaiementEffectueModel)
            .where(sql`
                ${PaiementEffectueModel.paiementId} = ${paiementId} AND 
                ${PaiementEffectueModel.etudiantMatricule} = ${matricule} AND
                ${PaiementEffectueModel.statut} = ${StatutPaiement.VALIDE}
            `)
            .limit(1);

        return result.length > 0;
    }
} 