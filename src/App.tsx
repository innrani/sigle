// Main application entry point - Refactored for better modularity

import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

// Types
import type { Client, Part, Technician, PageType } from "./types";

import { useClock } from "../hooks/useClock";

// Components - Modals
import { AddClientModal } from "./components/AddClientModal";
import { AddPartModal } from "./components/AddPartModal";
import { EditClientModal } from "./components/EditClientModal";
import { EditPartModal } from "./components/EditPartModal";
import { TechniciansManagementModal } from "./components/TechniciansManagementModal";

// Components - Pages
import { MainLayout } from "./components/MainLayout";
import { ClientsPage } from "./components/ClientsPage";
import { PartsPage } from "./components/PartsPage";
import { EquipmentsPage } from "./components/EquipamentsPage";

// UI Components
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const currentTime = useClock();
  const [clients, setClients] = useState<Client[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [activeTechnicianId, setActiveTechnicianId] = useState<string | null>(null);

  // Page navigation state
  const [currentPage, setCurrentPage] = useState<PageType>("main");

  // Modal states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isEditPartModalOpen, setIsEditPartModalOpen] = useState(false);
  const [isTechniciansModalOpen, setIsTechniciansModalOpen] = useState(false);
  const [isTechnicianSelectionModalOpen, setIsTechnicianSelectionModalOpen] = useState(false);

  // Edit states
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [partToEdit, setPartToEdit] = useState<Part | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // ==================== HANDLERS ====================

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setAppointments((prev) => {
      const newCards = [...prev];
      const dragged = newCards[dragIndex];
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, dragged);
      return newCards;
    });
  }, []);

  const handleClientAdded = (client: Client) => {
    setClients((prev) => [...prev, client]);
    toast.success("Cliente adicionado com sucesso!");
    setIsClientModalOpen(false);
  };

  const handleClientUpdated = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    toast.success("Cliente atualizado com sucesso!");
  };

  const handleDeleteClient = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente excluído com sucesso");
    }
  };

  const handleAddPart = (part: Part) => {
    setParts((prev) => [...prev, part]);
    toast.success("Peça adicionada com sucesso!");
    setIsPartModalOpen(false);
  };

  const handleEditPart = (updatedPart: Part) => {
    setParts((prev) => prev.map((p) => (p.id === updatedPart.id ? updatedPart : p)));
    toast.success("Peça atualizada com sucesso!");
  };

  const handleDeletePart = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta peça?")) {
      setParts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Peça excluída com sucesso");
    }
  };

  // Technicians
  const handleAddTechnician = (technician: Technician) => {
    setTechnicians((prev) => [...prev, technician]);
    toast.success("Técnico adicionado com sucesso!");
  };

  const handleUpdateTechnician = (updated: Technician) => {
    setTechnicians((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    toast.success("Técnico atualizado com sucesso!");
  };

  const handleDeleteTechnician = (id: string) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
    toast.success("Técnico excluído com sucesso");
  };

  const handleSelectTechnician = (id: string) => {
    setActiveTechnicianId(id);
    setIsTechnicianSelectionModalOpen(false);
  };

  const activeTechnician = activeTechnicianId ? technicians.find((t) => t.id === activeTechnicianId) ?? null : null;

  // ==================== RENDER ====================

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" />
      <div className="h-screen bg-[#f5f0e8] overflow-hidden flex">
        {/* Page Routing */}
        {currentPage === "clients" ? (
          <ClientsPage
            onBack={() => setCurrentPage("main")}
            clients={clients}
            onOpenAddModal={() => setIsClientModalOpen(true)}
            onOpenEditModal={(c) => { setClientToEdit(c); setIsEditClientModalOpen(true); }}
            onClientDeleted={handleDeleteClient}
            showInactive={false}
            onToggleShowInactive={() => {}}
            onClientReactivated={() => {}}
            isLoading={false}
          />
        ) : currentPage === "parts" ? (
          <PartsPage
            onBack={() => setCurrentPage("main")}
            parts={parts}
            onAddPart={() => setIsPartModalOpen(true)}
            onEditPart={(p) => { setPartToEdit(p); setIsEditPartModalOpen(true); }}
            onDeletePart={handleDeletePart}
          />
        ) : currentPage === "equipments" ? (
          <EquipmentsPage onBack={() => setCurrentPage("main")} />
        ) : (
          <MainLayout
            currentTime={currentTime}
            appointments={appointments}
            parts={parts}
            clients={clients}
            activeTechnician={activeTechnician}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            onMoveCard={moveCard}
            onAddClient={() => setIsClientModalOpen(true)}
            onAddAppointment={() => {}}
            onAddPart={() => setIsPartModalOpen(true)}
            onNavigateToClients={() => setCurrentPage("clients")}
            onNavigateToParts={() => setCurrentPage("parts")}
            onNavigateToEquipments={() => setCurrentPage("equipments")}
            onManageTechnicians={() => setIsTechniciansModalOpen(true)}
            onChangeTechnician={() => setIsTechnicianSelectionModalOpen(true)}
          />
        )}

        {/* Modals */}
        <AddClientModal open={isClientModalOpen} onOpenChange={setIsClientModalOpen} onClientAdded={handleClientAdded} />
        <EditClientModal open={isEditClientModalOpen} onOpenChange={setIsEditClientModalOpen} client={clientToEdit} onClientUpdated={handleClientUpdated} />
        <AddPartModal open={isPartModalOpen} onOpenChange={setIsPartModalOpen} onAddPart={handleAddPart} />
        <EditPartModal open={isEditPartModalOpen} onOpenChange={setIsEditPartModalOpen} part={partToEdit} onEditPart={handleEditPart} />
        <TechniciansManagementModal open={isTechniciansModalOpen} onOpenChange={setIsTechniciansModalOpen} technicians={technicians} onAddTechnician={handleAddTechnician} onUpdateTechnician={handleUpdateTechnician} onDeleteTechnician={handleDeleteTechnician} />
      </div>
    </DndProvider>
  );
}

