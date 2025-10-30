// src/components/MainLayout.tsx

<<<<<<< HEAD
import { useRef, useState } from "react";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { RightSidebar } from "./RightSidebar";
import type { Appointment, Part, Client, Technician } from "../types";

interface MainLayoutProps {
  currentTime: Date;
  appointments: Appointment[];
  parts: Part[];
  clients: Client[];
  activeTechnician?: Technician | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  onAddServiceOrder?: () => void; // deprecated
  onAddClient: () => void;
  onAddAppointment: () => void;
  onAddPart: () => void;
  onNavigateToClients: () => void;
  onNavigateToParts: () => void;
  onNavigateToEquipments: () => void;
  onManageTechnicians: () => void;
  onChangeTechnician: () => void;
}

export function MainLayout({
  currentTime,
  parts,
  clients,
  activeTechnician,
  searchQuery,
  onSearchChange,
  onMoveCard,
  onAddClient,
  onAddPart,
  onNavigateToHistory,
  onNavigateToClients,
  onNavigateToParts,
  onNavigateToEquipments,
  onManageTechnicians,
  onChangeTechnician,
}: MainLayoutProps) {
  const appointmentsScrollRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [selectedPartType, setSelectedPartType] = useState<string>("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const scrollToBottom = () => {
    if (appointmentsScrollRef.current) {
      appointmentsScrollRef.current.scrollTo({
        top: appointmentsScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // TODO: MIGRAÇÃO PARA BD - Substituir por chamadas à API
  // const partTypes = await fetch('/api/part-types').then(r => r.json());
  // const technicians = await fetch('/api/technicians').then(r => r.json());
  
  return (
    <>
      <div className="flex-1 p-4">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex gap-3">
            <div className="w-[280px] flex-shrink-0">
              <DateTimeDisplay currentTime={currentTime} />
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p>Main content area - components being rebuilt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[200px] flex-shrink-0 h-screen">
        <RightSidebar 
          activeTechnician={activeTechnician}
          onAddClient={onAddClient}
          onNavigateToClients={onNavigateToClients}
          onNavigateToParts={onNavigateToParts}
          onNavigateToEquipments={onNavigateToEquipments}
          onManageTechnicians={onManageTechnicians}
          onChangeTechnician={onChangeTechnician}
        />
      </div>
    </>
  );
}
=======
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
      <div className="flex-1 p-4 h-full">
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
>>>>>>> 81ed30ef804a4c2f516ba630d37a2217f0258421
