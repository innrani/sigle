// src/components/MainLayout.tsx

import { RightSidebar } from "./RightSidebar";
import type {Client } from "../types/index"; // Garanta que o caminho do tipo esteja correto

interface MainLayoutProps {  
  clients: Client[];
  searchQuery: string;
  onSearchChange: (query: string) => void;  
  // CORREÇÃO: Renomeado para refletir o App.tsx
  onOpenAddModal: () => void;  
  onNavigateToClients: () => void;  
}

export function MainLayout({        
  // CORREÇÃO: Usando o novo nome da prop
  onOpenAddModal,  
  onNavigateToClients,
  // Outras props não usadas diretamente no retorno foram omitidas para clareza
}: MainLayoutProps) { 
 
  return (
    <>
      <div className="flex-1 p-4">
      </div>

      {/* Right Sidebar */}
      <div className="w-[200px] flex-shrink-0 h-screen">
        <RightSidebar           
          // CORREÇÃO: Passando a prop para o RightSidebar. 
            // Como vamos corrigir o RightSidebar abaixo, ele deve aceitar onOpenAddModal.
          onOpenAddModal={onOpenAddModal}          
          onNavigateToClients={onNavigateToClients}          
        />
      </div>
    </>
  );
}