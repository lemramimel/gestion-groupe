import { BaseService } from './BaseService';
import { SousGroupe, Etudiant } from '../models';
import { SousGroupeModel, SousGroupesEtudiantsModel, EtudiantModel } from '@/db/schema';
import { db } from '@/db/database';
import { sql } from 'drizzle-orm';

export class SousGroupeService extends BaseService<SousGroupe> {
    protected table = SousGroupeModel;

    async addEtudiant(sousGroupeId: number, matricule: string): Promise<boolean> {
        try {
            await db.insert(SousGroupesEtudiantsModel)
                .values({
                    sousGroupeId,
                    matricule
                });
            return true;
        } catch (error) {
            return false;
        }
    }

    async removeEtudiant(sousGroupeId: number, matricule: string): Promise<boolean> {
        const result = await db
            .delete(SousGroupesEtudiantsModel)
            .where(sql`${SousGroupesEtudiantsModel.sousGroupeId} = ${sousGroupeId}
                AND ${SousGroupesEtudiantsModel.matricule} = ${matricule}`)
            .returning();
        return result.length > 0;
    }

    async getEtudiants(sousGroupeId: number): Promise<Etudiant[]> {
        const result = await db
            .select({
                idEtudiant: EtudiantModel.idEtudiant,
                matricule: EtudiantModel.matricule,
                nom: EtudiantModel.nom,
                dateCreation: EtudiantModel.dateCreation,
                dateModification: EtudiantModel.dateModification
            })
            .from(SousGroupesEtudiantsModel)
            .innerJoin(
                EtudiantModel,
                sql`${SousGroupesEtudiantsModel.matricule} = ${EtudiantModel.matricule}`
            )
            .where(sql`${SousGroupesEtudiantsModel.sousGroupeId} = ${sousGroupeId}`);

        return result as Etudiant[];
    }
} 