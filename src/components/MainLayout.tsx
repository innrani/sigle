// Main layout component

import { useRef, useState } from "react";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { AppointmentsSection } from "./AppointmentsSection";
import { SearchAndFilters, FilterOptions } from "./SearchAndFilters";
import { WeekViewSection } from "./WeekViewSection";
import { PartsSectionWrapper } from "./PartsSectionWrapper";
import { RightSidebar } from "./RightSidebar";
import type { Appointment, Part, Client, ServiceOrder, Technician } from "../types";
import { PART_TYPES, STORAGE_KEYS } from "../lib/constants";

interface MainLayoutProps {
  currentTime: Date;
  appointments: Appointment[];
  deliveryOrders: ServiceOrder[];
  parts: Part[];
  clients: Client[];
  activeTechnician?: Technician | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  onToggleDelivered: (serviceOrder: ServiceOrder) => void;
  onAddServiceOrder: () => void;
  onAddClient: () => void;
  onAddAppointment: () => void;
  onAddPart: () => void;
  onNavigateToHistory: () => void;
  onNavigateToClients: () => void;
  onNavigateToParts: () => void;
  onNavigateToWarranties: () => void;
  onNavigateToBudgets: () => void;
  onNavigateToInvoices: () => void;
  onNavigateToEquipments: () => void;
  onManageTechnicians: () => void;
  onChangeTechnician: () => void;
}

export function MainLayout({
  currentTime,
  appointments,
  deliveryOrders,
  parts,
  clients,
  activeTechnician,
  searchQuery,
  onSearchChange,
  onMoveCard,
  onToggleDelivered,
  onAddServiceOrder,
  onAddClient,
  onAddAppointment,
  onAddPart,
  onNavigateToHistory,
  onNavigateToClients,
  onNavigateToParts,
  onNavigateToWarranties,
  onNavigateToBudgets,
  onNavigateToInvoices,
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
  
  // Get technicians from localStorage
  // TODO: BD - Substituir por: const technicians = await db.technicians.findMany({ where: { active: true } })
  const technicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.TECHNICIANS) || "[]");
  const technicianNames = technicians.map((t: Technician) => t.name);

  // Prepare filter options
  // TODO: BD - Carregar opções do banco de dados
  const filterOptions: FilterOptions = {
    partTypes: [...PART_TYPES],  // Lista fixa de tipos de peças (TVs e Projetores)
    technicians: technicianNames,  // TODO: BD - Carregar de: await db.technicians.findMany()
    statuses: ["Chegando", "À Encomendar"]  // TODO: BD - Enum ou tabela 'part_statuses'
  };

  // TODO: MIGRAÇÃO PARA BD - Filtros devem ser feitos no servidor
  // const filteredAppointments = await db.appointments.findMany({
  //   where: {
  //     OR: [
  //       { name: { contains: query, mode: 'insensitive' } },
  //       { service: { contains: query, mode: 'insensitive' } },
  //       { model: { contains: query, mode: 'insensitive' } }
  //     ]
  //   }
  // });
  
  // Filter appointments based on search
  const filteredAppointments = appointments.filter((appointment) => {
    const query = searchQuery.toLowerCase();
    return (
      appointment.name.toLowerCase().includes(query) ||
      appointment.service.toLowerCase().includes(query) ||
      appointment.model.toLowerCase().includes(query)
    );
  });

  // TODO: MIGRAÇÃO PARA BD - Filtros devem ser feitos no servidor com query params
  // const filteredParts = await db.parts.findMany({
  //   where: {
  //     AND: [
  //       query ? { OR: [{ name: { contains: query } }, { osNumber: { contains: query } }] } : {},
  //       partType ? { partType: { equals: partType } } : {},
  //       status ? { status: { equals: status } } : {},
  //       technician ? { technicianId: { equals: technician } } : {}
  //     ]
  //   }
  // });
  
  // Filter parts based on search AND filters
  const filteredParts = parts.filter((part) => {
    const query = searchQuery.toLowerCase();
    
    // Search filter
    const matchesSearch = 
      part.name.toLowerCase().includes(query) ||
      part.osNumber.toLowerCase().includes(query) ||
      part.osDescription.toLowerCase().includes(query);
    
    // Part type filter
    const matchesPartType = !selectedPartType || part.name === selectedPartType;
    
    // Status filter (map between UI labels and data values)
    // TODO: BD - Usar enum direto do banco: part.status === selectedStatus
    let matchesStatus = true;
    if (selectedStatus) {
      if (selectedStatus === "Chegando") {
        matchesStatus = part.status === "arriving";
      } else if (selectedStatus === "À Encomendar") {
        matchesStatus = part.status === "to-order";
      }
    }
    
    // TODO: BD - Adicionar campo technicianId em Part
    // const matchesTechnician = !selectedTechnician || part.technicianId === selectedTechnician;
    // Technician filter - would need to be added to Part type in the future
    // For now, we skip this filter for parts
    
    return matchesSearch && matchesPartType && matchesStatus;
  });

  // Global search results check
  const hasGlobalSearchResults = searchQuery.length > 0 && (
    filteredAppointments.length > 0 ||
    filteredParts.length > 0 ||
    clients.some(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div className="flex-1 p-4">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex gap-3">
            {/* Left Section */}
            <div className="w-[280px] flex-shrink-0">
              <DateTimeDisplay currentTime={currentTime} />
              <AppointmentsSection
                deliveryOrders={deliveryOrders}
                scrollRef={appointmentsScrollRef}
                onMoveCard={onMoveCard}
                onScrollToBottom={scrollToBottom}
                onToggleDelivered={onToggleDelivered}
              />
            </div>

            {/* Center Section */}
            <div className="flex-1 min-w-0">
              <SearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                hasResults={hasGlobalSearchResults}
                filterOptions={filterOptions}
                selectedPartType={selectedPartType}
                selectedTechnician={selectedTechnician}
                selectedStatus={selectedStatus}
                onPartTypeChange={setSelectedPartType}
                onTechnicianChange={setSelectedTechnician}
                onStatusChange={setSelectedStatus}
              />
              <WeekViewSection onAddAppointment={onAddAppointment} />
              <PartsSectionWrapper parts={filteredParts} onAddPart={onAddPart} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[200px] flex-shrink-0 h-screen">
        <RightSidebar 
          activeTechnician={activeTechnician}
          onAddServiceOrder={onAddServiceOrder}
          onAddClient={onAddClient}
          onNavigateToHistory={onNavigateToHistory}
          onNavigateToClients={onNavigateToClients}
          onNavigateToParts={onNavigateToParts}
          onNavigateToWarranties={onNavigateToWarranties}
          onNavigateToBudgets={onNavigateToBudgets}
          onNavigateToInvoices={onNavigateToInvoices}
          onNavigateToEquipments={onNavigateToEquipments}
          onManageTechnicians={onManageTechnicians}
          onChangeTechnician={onChangeTechnician}
        />
      </div>
    </>
  );
}
