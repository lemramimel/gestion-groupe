import { BaseModel } from './BaseModel';

export interface SousGroupe extends BaseModel {
    idSousGroupe: number;
    nomSousGroupe: string;
    groupeId: number;
} 