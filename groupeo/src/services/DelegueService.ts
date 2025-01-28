import { BaseService } from './BaseService';
import { Delegue } from '../models/Delegue';
import { DelegueModel } from '@/db/schema';
import { db } from '@/db/database';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export class DelegueService extends BaseService<Delegue> {
    protected table = DelegueModel;

    async register(data: {
        nom: string;
        email: string;
        password: string;
    }): Promise<Delegue | null> {
        try {
            // Vérifier si l'email existe déjà
            const existingDelegue = await this.findByEmail(data.email);
            if (existingDelegue) {
                return null;
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Créer le délégué
            const result = await db
                .insert(DelegueModel)
                .values({
                    nom: data.nom,
                    email: data.email,
                    password: hashedPassword,
                })
                .returning() as Delegue[];

            return result[0];
        } catch (error) {
            console.error('Erreur lors de la création du délégué:', error);
            return null;
        }
    }

    async login(email: string, password: string): Promise<Delegue | null> {
        try {
            // Trouver le délégué par email
            const delegue = await this.findByEmail(email);
            if (!delegue) {
                return null;
            }

            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(password, delegue.password);
            if (!isPasswordValid) {
                return null;
            }

            return delegue;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return null;
        }
    }

    private async findByEmail(email: string): Promise<Delegue | null> {
        const result = await db
            .select()
            .from(this.table)
            .where(sql`${this.table}.email = ${email}`)
            .limit(1);
        
        return (result[0] as unknown as Delegue) || null;
    }
} 