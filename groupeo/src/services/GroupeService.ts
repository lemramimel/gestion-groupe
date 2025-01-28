import { BaseService } from './BaseService';
import { Groupe, GroupeWithRelations } from '../models';
import { GroupeModel, SousGroupeModel } from '@/db/schema';
import { db } from '@/db/database';
import { sql } from 'drizzle-orm';

export class GroupeService extends BaseService<Groupe> {
    protected table = GroupeModel;

    async findWithRelations(id: number): Promise<GroupeWithRelations | null> {
        const groupe = await this.findById(id);
        if (!groupe) return null;

        const sousGroupes = await db
            .select()
            .from(SousGroupeModel)
            .where(sql`${SousGroupeModel.groupeId} = ${id}`);

        return {
            ...groupe,
            sousGroupes
        };
    }
} 