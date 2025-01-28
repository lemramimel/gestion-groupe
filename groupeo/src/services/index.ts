import { EtudiantService } from './EtudiantService';
import { GroupeService } from './GroupeService';
import { PaiementService } from './PaiementService';
import { SousGroupeService } from './SousGroupeService';
import { DelegueService } from './DelegueService';
import { ExportService } from './ExportService';
import { DocumentationService } from './DocumentationService';


// Instance singleton pour chaque service
export const etudiantService = new EtudiantService();
export const paiementService = new PaiementService();
export const groupeService = new GroupeService();
export const sousGroupeService = new SousGroupeService();
export const delegueService = new DelegueService();
export const exportService = new ExportService(
    groupeService,
    sousGroupeService,
    paiementService
);

export const documentationService = new DocumentationService();

// Fonction d'initialisation à appeler au démarrage de l'application
export async function generateInitialDocumentation() {
    await documentationService.generateDocumentation('./documentation.pdf');
} 