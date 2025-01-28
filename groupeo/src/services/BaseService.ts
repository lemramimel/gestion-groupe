import { db } from '@/db/database';
import { BaseModel } from '../models/BaseModel';
import { sql, SQL } from 'drizzle-orm';

export abstract class BaseService<T extends BaseModel> {
    protected abstract table: any;
    
    async findAll(): Promise<T[]> {
        const result = await db
            .select()
            .from(this.table);
        return result as unknown as T[];
    }

    async findById(id: number): Promise<T | null> {
        const result = await db
            .select()
            .from(this.table)
            .where(sql`${this.table}.id = ${id}`)
            .limit(1);
        return (result[0] as unknown as T) || null;
    }

    async create(data: Omit<T, 'id' | 'dateCreation' | 'dateModification'>): Promise<T> {
        const result = await db.insert(this.table).values(data).returning() as T[];
        return result[0];
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        const result = await db
            .update(this.table)
            .set(data)
            .where(sql`${this.table}.id = ${id}`)
            .returning() as T[];
        return result[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await db
            .delete(this.table)
            .where(sql`${this.table}.id = ${id}`)
            .returning() as T[];
        return result.length > 0;
    }
} 