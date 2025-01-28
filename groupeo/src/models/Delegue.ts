import { BaseModel } from './BaseModel';

export interface Delegue extends BaseModel {
    idDelegue: number;
    nom: string;
    email: string;
    password: string;
} 