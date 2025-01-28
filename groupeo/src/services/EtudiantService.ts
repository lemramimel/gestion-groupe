import { BaseService } from './BaseService';
import { Etudiant, EtudiantWithRelations } from '../models';
import { EtudiantModel, SousGroupesEtudiantsModel, SousGroupeModel } from '@/db/schema';
import { db } from '@/db/database';
import { sql } from 'drizzle-orm';

export class EtudiantService extends BaseService<Etudiant> {
    protected table = EtudiantModel;

    async findByMatricule(matricule: string): Promise<Etudiant | null> {
        const result = await db
            .select()
            .from(this.table)
            .where(sql`${this.table}.matricule = ${matricule}`)
            .limit(1);
        return result[0] || null;
    }

    async findWithRelations(id: number): Promise<EtudiantWithRelations | null> {
        const etudiant = await this.findById(id);
        if (!etudiant) return null;

        const sousGroupes = await db
            .select({
                idSousGroupe: SousGroupeModel.idSousGroupe,
                nomSousGroupe: SousGroupeModel.nomSousGroupe,
                groupeId: SousGroupeModel.groupeId
            })
            .from(SousGroupesEtudiantsModel)
            .innerJoin(
                SousGroupeModel,
                sql`${SousGroupesEtudiantsModel.sousGroupeId} = ${SousGroupeModel.idSousGroupe}`
            )
            .where(sql`${SousGroupesEtudiantsModel.matricule} = ${etudiant.matricule}`);

        return {
            ...etudiant,
            sousGroupes
        };
    }
} 