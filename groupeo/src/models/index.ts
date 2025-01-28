import { Etudiant } from '@/src/models/Etudiant';
import { SousGroupe } from './SousGroupe';
import { PaiementEffectue, StatutPaiement } from '@/src/models/PaiementEffectue';
import { Groupe } from '@/src/models/Groupe';
import { Paiement } from '@/src/models/Paiement';


// Export des types pour les relations
export interface EtudiantWithRelations extends Etudiant {
    sousGroupes?: SousGroupe[];
    paiementsEffectues?: PaiementEffectue[];
}

export interface GroupeWithRelations extends Groupe {
    sousGroupes?: SousGroupe[];
}

export interface SousGroupeWithRelations extends SousGroupe {
    groupe?: Groupe;
    etudiants?: Etudiant[];
}

export interface PaiementWithRelations extends Paiement {
    paiementsEffectues?: PaiementEffectue[];
}

export interface PaiementEffectueWithRelations extends PaiementEffectue {
    paiement?: Paiement;
    etudiant?: Etudiant;
} 

export { Etudiant, Groupe, Paiement, PaiementEffectue, SousGroupe, StatutPaiement };
