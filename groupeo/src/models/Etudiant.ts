import { BaseModel } from './BaseModel';

export interface Etudiant extends BaseModel {
    idEtudiant: number;
    matricule: string;
    nom: string;
    dateCreation: string | null;
    dateModification: string | null;
} 