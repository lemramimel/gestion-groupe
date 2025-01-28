import { BaseModel } from './BaseModel';

export interface Paiement extends BaseModel {
    idPaiement: number;
    nomPaiement: string;
    description: string;
    montant: number;
} 