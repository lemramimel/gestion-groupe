export enum StatutPaiement {
    EN_ATTENTE = 'en_attente',
    VALIDE = 'valide',
    REFUSE = 'refuse'
}

export interface PaiementEffectue {
    idPaiementEffectue: number;
    etudiantMatricule: string | null;
    paiementId: number | null;
    montantPaye: number;
    statut: StatutPaiement;
    date: string | null;
} 