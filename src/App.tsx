// Main application entry point - Refactored for better modularity

import { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

// Types
import type { Client, Appointment, Part, ServiceOrder, Technician, PageType } from "./types";

// Constants
import { STORAGE_KEYS, initialClients, initialAppointments, initialParts } from "./lib/constants";


import { useClock } from "./hooks/useClock";

// Components - Modals
import { AddServiceOrderModal } from "./components/AddServiceOrderModal";
import { AddClientModal } from "./components/AddClientModal";
//import { AddAppointmentModal } from "./components/AddAppointmentModal";
import { AddPartModal } from "./components/AddPartModal";
import { EditClientModal } from "./components/EditClientModal";
import { EditPartModal } from "./components/EditPartModal";
import { TechniciansManagementModal } from "./components/TechniciansManagementModal";
import { TechnicianSelectionModal } from "./components/TechnicianSelectionModal";
// import { FirstTimeSetupModal } from "./components/FirstTimeSetupModal";
import { ServiceOrderDetailModal } from "./components/ServiceOrderDetailModal";
import { ServiceOrderCompletionModal } from "./components/ServiceOrderCompletionModal";

// Components - Pages
import { MainLayout } from "./components/MainLayout";
import { HistoryPage } from "./components/HistoryPage";
import { ClientsPage } from "./components/ClientsPage";
import { PartsPage } from "./components/PartsPage";
//import { WarrantiesPage } from "./components/WarrantiesPage";
//import { BudgetsPage } from "./components/BudgetsPage";
//import { InvoicesPage } from "./components/InvoicesPage";
//import { EquipmentsPage } from "./components/EquipmentsPage";
//import { ServiceOrderPrintPage } from "./components/ServiceOrderPrintPage";

// UI Components
import { Toaster } from "./components/ui/sonner";

export default function App() {
  // SQL AQUI 
  const currentTime = useClock();
  const [clients, setClients] = useLocalStorage<Client[]>(STORAGE_KEYS.CLIENTS, initialClients);
  const [parts, setParts] = useLocalStorage<Part[]>(STORAGE_KEYS.PARTS, initialParts);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const [serviceOrders, setServiceOrders] = useLocalStorage<ServiceOrder[]>(STORAGE_KEYS.SERVICE_ORDERS, []);
  const [technicians, setTechnicians] = useLocalStorage<Technician[]>(STORAGE_KEYS.TECHNICIANS, []);
  const [isSetupComplete, setIsSetupComplete] = useLocalStorage<boolean>(STORAGE_KEYS.SETUP_COMPLETE, false);
  const [activeTechnicianId, setActiveTechnicianId] = useLocalStorage<string | null>(STORAGE_KEYS.ACTIVE_TECHNICIAN, null);
  
  // Page navigation state
  const [currentPage, setCurrentPage] = useState<PageType>("main");
  
  // Current service order for printing
  const [currentServiceOrder, setCurrentServiceOrder] = useState<ServiceOrder | null>(null);
  
  // Pre-selected client for O.S creation
  const [preSelectedClient, setPreSelectedClient] = useState<Client | null>(null);
  
  // Modal states
  const [isServiceOrderModalOpen, setIsServiceOrderModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isEditPartModalOpen, setIsEditPartModalOpen] = useState(false);
  const [isTechniciansModalOpen, setIsTechniciansModalOpen] = useState(false);
  const [isTechnicianSelectionModalOpen, setIsTechnicianSelectionModalOpen] = useState(false);
  const [isServiceOrderDetailModalOpen, setIsServiceOrderDetailModalOpen] = useState(false);
  const [isServiceOrderCompletionModalOpen, setIsServiceOrderCompletionModalOpen] = useState(false);
  
  // Edit states
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [partToEdit, setPartToEdit] = useState<Part | null>(null);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // ==================== HANDLERS ====================

  // Drag and drop handler for appointments
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setAppointments((prevCards) => {
      const newCards = [...prevCards];
      const draggedCard = newCards[dragIndex];
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCard);
      return newCards;
    });
  }, [setAppointments]);

  // Handler to add new client
  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
    
    // Check if technicians exist before opening O.S modal
    if (technicians.length === 0) {
      toast.success("Cliente adicionado com sucesso!", {
        description: "Cadastre um técnico para criar uma O.S.",
        action: {
          label: "Gerenciar Técnicos",
          onClick: () => {
            setIsClientModalOpen(false);
            setIsTechniciansModalOpen(true);
          },
        },
      });
      return;
    }
    
    toast.success("Cliente adicionado com sucesso!", {
      description: "Abrindo formulário de O.S...",
    });
    
    // Close client modal and open O.S modal with pre-selected client
    setIsClientModalOpen(false);
    setPreSelectedClient(client);
    setTimeout(() => {
      setIsServiceOrderModalOpen(true);
    }, 300);
  };

  // Handler to add new part
  const handleAddPart = (part: Part) => {
    setParts([...parts, part]);
    toast.success("Peça adicionada com sucesso!");
  };

  // Handler to add new appointment
  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    toast.success("Agendamento criado com sucesso!");
  };

  // Handler to edit client
  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsEditClientModalOpen(true);
  };

  // Handler to update client
  const handleUpdateClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    toast.success("Cliente atualizado com sucesso!");
  };

  // Handler to delete client
  const handleDeleteClient = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClients(clients.filter(c => c.id !== id));
      toast.success("Cliente excluído com sucesso");
    }
  };

  // Handler to edit part
  const handleEditPart = (part: Part) => {
    setPartToEdit(part);
    setIsEditPartModalOpen(true);
  };

  // Handler to update part
  const handleUpdatePart = (updatedPart: Part) => {
    setParts(parts.map(p => p.id === updatedPart.id ? updatedPart : p));
    toast.success("Peça atualizada com sucesso!");
  };

  // Handler to delete part
  const handleDeletePart = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta peça?")) {
      setParts(parts.filter(p => p.id !== id));
      toast.success("Peça excluída com sucesso");
    }
  };

  // Handler to open service order modal with validation
  const handleOpenServiceOrderModal = () => {
    if (clients.length === 0) {
      toast.error("Cadastre um cliente primeiro", {
        description: "É necessário ter pelo menos um cliente cadastrado para criar uma O.S.",
        action: {
          label: "Cadastrar Cliente",
          onClick: () => setIsClientModalOpen(true),
        },
      });
      return;
    }
    
    if (technicians.length === 0) {
      toast.error("Cadastre um técnico primeiro", {
        description: "É necessário ter pelo menos um técnico cadastrado para criar uma O.S.",
        action: {
          label: "Gerenciar Técnicos",
          onClick: () => setIsTechniciansModalOpen(true),
        },
      });
      return;
    }
    
    setPreSelectedClient(null);
    setIsServiceOrderModalOpen(true);
  };

  // Handler to create service order
  const handleCreateServiceOrder = (serviceOrder: ServiceOrder) => {
    setCurrentServiceOrder(serviceOrder);
    setCurrentPage("print-os");
    toast.success("O.S criada com sucesso!");
  };

  // Handler to save service order to history
  const handleSaveToHistory = (status: ServiceOrder["status"]) => {
    if (currentServiceOrder) {
      const updatedServiceOrder = { ...currentServiceOrder, status };
      setServiceOrders([...serviceOrders, updatedServiceOrder]);
      toast.success("O.S adicionada ao histórico com sucesso!");
      setCurrentPage("history");
      setCurrentServiceOrder(null);
    }
  };

  // Handler to select service order from history
  const handleSelectServiceOrder = (serviceOrder: ServiceOrder) => {
    setSelectedServiceOrder(serviceOrder);
    setIsServiceOrderDetailModalOpen(true);
  };

  // Handler to update service order
  const handleUpdateServiceOrder = (updatedServiceOrder: ServiceOrder) => {
    setServiceOrders(serviceOrders.map(so => so.id === updatedServiceOrder.id ? updatedServiceOrder : so));
    toast.success("O.S atualizada com sucesso!");
  };

  // Handler to mark service order as ready (opens completion modal)
  const handleMarkAsReady = (serviceOrder: ServiceOrder) => {
    setSelectedServiceOrder(serviceOrder);
    setIsServiceOrderDetailModalOpen(false);
    setIsServiceOrderCompletionModalOpen(true);
  };

  // Handler to complete service order
  const handleCompleteServiceOrder = (completedServiceOrder: ServiceOrder) => {
    setServiceOrders(serviceOrders.map(so => so.id === completedServiceOrder.id ? completedServiceOrder : so));
    setIsServiceOrderCompletionModalOpen(false);
    toast.success("O.S finalizada com sucesso!", {
      description: `Garantia de ${completedServiceOrder.warrantyMonths || 3} meses ativada!`,
    });
  };

  // Handler to complete and print service order
  const handlePrintAndCompleteServiceOrder = (completedServiceOrder: ServiceOrder) => {
    setServiceOrders(serviceOrders.map(so => so.id === completedServiceOrder.id ? completedServiceOrder : so));
    setIsServiceOrderCompletionModalOpen(false);
    setCurrentServiceOrder(completedServiceOrder);
    setCurrentPage("print-os");
    toast.success("O.S finalizada com sucesso!", {
      description: "Preparando impressão com informações de garantia...",
    });
  };

  // Handler to complete first time setup
  const handleCompleteSetup = (technician: Technician) => {
    setTechnicians([technician]);
    setIsSetupComplete(true);
    setActiveTechnicianId(technician.id);
    toast.success(`Bem-vindo, ${technician.name}!`, {
      description: "Sistema configurado! Agora você pode cadastrar clientes e criar Ordens de Serviço.",
      duration: 5000,
    });
  };

  // Handlers for technician management
  const handleAddTechnician = (technician: Technician) => {
    setTechnicians([...technicians, technician]);
    toast.success("Técnico adicionado com sucesso!");
  };

  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    setTechnicians(technicians.map(t => t.id === updatedTechnician.id ? updatedTechnician : t));
    toast.success("Técnico atualizado com sucesso!");
  };

  const handleDeleteTechnician = (id: string) => {
    if (technicians.length === 1) {
      toast.error("Não é possível excluir o único técnico", {
        description: "Adicione outro técnico antes de excluir este.",
      });
      return;
    }
    
    // Se estiver deletando o técnico ativo, limpar a seleção
    if (id === activeTechnicianId) {
      setActiveTechnicianId(null);
      setIsTechnicianSelectionModalOpen(true);
    }
    
    setTechnicians(technicians.filter(t => t.id !== id));
    toast.success("Técnico excluído com sucesso");
  };

  // Handler to select technician
  const handleSelectTechnician = (technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    if (technician) {
      setActiveTechnicianId(technicianId);
      setIsTechnicianSelectionModalOpen(false);
      toast.success(`Olá, ${technician.name}!`, {
        description: "Você está operando o sistema agora.",
        duration: 3000,
      });
    }
  };

  // Handler to add technician from selection modal
  const handleAddTechnicianFromSelection = (name: string, phone?: string) => {
    const newTechnician: Technician = {
      id: crypto.randomUUID(),
      name,
      phone,
      createdAt: new Date().toISOString(),
    };
    setTechnicians([...technicians, newTechnician]);
    setActiveTechnicianId(newTechnician.id);
    setIsTechnicianSelectionModalOpen(false);
    toast.success(`Técnico ${name} adicionado!`, {
      description: "Você está operando o sistema agora.",
      duration: 3000,
    });
  };

  // Handler to toggle delivery status
  const handleToggleDelivered = (serviceOrder: ServiceOrder) => {
    const newStatus = serviceOrder.status === "completed" ? "in-progress" : "completed";
    const updatedServiceOrder = {
      ...serviceOrder,
      status: newStatus,
      deliveryDate: newStatus === "completed" ? new Date().toISOString() : serviceOrder.deliveryDate,
      updatedAt: new Date().toISOString()
    };
    setServiceOrders(serviceOrders.map(so => so.id === updatedServiceOrder.id ? updatedServiceOrder : so));
    
    if (newStatus === "completed") {
      toast.success("Ordem entregue ao cliente!", {
        description: `${serviceOrder.clientName} retirou o equipamento.`,
      });
    } else {
      toast.info("Status alterado", {
        description: "Ordem marcada como não entregue.",
      });
    }
  };

  // Get today's delivery orders
  const getTodaysDeliveries = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return serviceOrders.filter((order: ServiceOrder) => {
      if (!order.deliveryDate) return false;
      const deliveryDate = new Date(order.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate.getTime() === today.getTime();
    });
  };

  const todaysDeliveries = getTodaysDeliveries();

  // Check if technician selection is needed (setup complete but no active technician)
  const needsTechnicianSelection = isSetupComplete && !activeTechnicianId && technicians.length > 0;

  // Get active technician
  const activeTechnician = activeTechnicianId ? technicians.find(t => t.id === activeTechnicianId) : null;

  // ==================== RENDER ====================

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" />
      <div className="h-screen bg-[#f5f0e8] overflow-hidden flex">
        {/* Page Routing */}
        {currentPage === "history" ? (
          <HistoryPage 
            onBack={() => setCurrentPage("main")}
            serviceOrders={serviceOrders}
            onSelectServiceOrder={handleSelectServiceOrder}
          />
        ) : currentPage === "clients" ? (
          <ClientsPage 
            onBack={() => setCurrentPage("main")}
            clients={clients}
            onAddClient={() => setIsClientModalOpen(true)}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
        ) : currentPage === "parts" ? (
          <PartsPage
            onBack={() => setCurrentPage("main")}
            parts={parts}
            onAddPart={() => setIsPartModalOpen(true)}
            onEditPart={handleEditPart}
            onDeletePart={handleDeletePart}
          />
        ) : currentPage === "warranties" ? (
          <WarrantiesPage 
            onBack={() => setCurrentPage("main")}
            serviceOrders={serviceOrders}
            onSelectServiceOrder={handleSelectServiceOrder}
          />
        ) : currentPage === "budgets" ? (
          <BudgetsPage onBack={() => setCurrentPage("main")} />
        ) : currentPage === "invoices" ? (
          <InvoicesPage onBack={() => setCurrentPage("main")} />
        ) : currentPage === "equipments" ? (
          <EquipmentsPage 
            onBack={() => setCurrentPage("main")}
            serviceOrders={serviceOrders}
            onViewServiceOrder={handleSelectServiceOrder}
          />
        ) : currentPage === "print-os" && currentServiceOrder ? (
          <ServiceOrderPrintPage
            serviceOrder={currentServiceOrder}
            onBack={() => setCurrentPage("main")}
            onSaveToHistory={handleSaveToHistory}
          />
        ) : (
          <MainLayout
            currentTime={currentTime}
            appointments={appointments}
            deliveryOrders={todaysDeliveries}
            parts={parts}
            clients={clients}
            activeTechnician={activeTechnician}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMoveCard={moveCard}
            onToggleDelivered={handleToggleDelivered}
            onAddServiceOrder={handleOpenServiceOrderModal}
            onAddClient={() => setIsClientModalOpen(true)}
            onAddAppointment={() => setIsAppointmentModalOpen(true)}
            onAddPart={() => setIsPartModalOpen(true)}
            onNavigateToHistory={() => setCurrentPage("history")}
            onNavigateToClients={() => setCurrentPage("clients")}
            onNavigateToParts={() => setCurrentPage("parts")}
            onNavigateToWarranties={() => setCurrentPage("warranties")}
            onNavigateToBudgets={() => setCurrentPage("budgets")}
            onNavigateToInvoices={() => setCurrentPage("invoices")}
            onNavigateToEquipments={() => setCurrentPage("equipments")}
            onManageTechnicians={() => setIsTechniciansModalOpen(true)}
            onChangeTechnician={() => setIsTechnicianSelectionModalOpen(true)}
          />
        )}

        {/* Modals */}
        <FirstTimeSetupModal 
          open={!isSetupComplete}
          onComplete={handleCompleteSetup}
        />
        <TechnicianSelectionModal
          open={needsTechnicianSelection || isTechnicianSelectionModalOpen}
          technicians={technicians}
          onSelectTechnician={handleSelectTechnician}
          onAddNewTechnician={handleAddTechnicianFromSelection}
        />
        <AddServiceOrderModal 
          open={isServiceOrderModalOpen} 
          onOpenChange={setIsServiceOrderModalOpen}
          clients={clients}
          technicians={technicians}
          activeTechnicianId={activeTechnicianId}
          onCreateServiceOrder={handleCreateServiceOrder}
          preSelectedClient={preSelectedClient}
        />
        <AddClientModal 
          open={isClientModalOpen} 
          onOpenChange={setIsClientModalOpen}
          onAddClient={handleAddClient}
        />
        <AddAppointmentModal 
          open={isAppointmentModalOpen} 
          onOpenChange={setIsAppointmentModalOpen}
          onAddAppointment={handleAddAppointment}
        />
        <AddPartModal 
          open={isPartModalOpen} 
          onOpenChange={setIsPartModalOpen}
          onAddPart={handleAddPart}
        />
        <EditClientModal
          open={isEditClientModalOpen}
          onOpenChange={setIsEditClientModalOpen}
          client={clientToEdit}
          onEditClient={handleUpdateClient}
        />
        <EditPartModal
          open={isEditPartModalOpen}
          onOpenChange={setIsEditPartModalOpen}
          part={partToEdit}
          onEditPart={handleUpdatePart}
        />
        <TechniciansManagementModal
          open={isTechniciansModalOpen}
          onOpenChange={setIsTechniciansModalOpen}
          technicians={technicians}
          onAddTechnician={handleAddTechnician}
          onUpdateTechnician={handleUpdateTechnician}
          onDeleteTechnician={handleDeleteTechnician}
        />
        <ServiceOrderDetailModal
          open={isServiceOrderDetailModalOpen}
          onOpenChange={setIsServiceOrderDetailModalOpen}
          serviceOrder={selectedServiceOrder}
          clients={clients}
          technicians={technicians}
          onUpdateServiceOrder={handleUpdateServiceOrder}
          onMarkAsReady={handleMarkAsReady}
        />
        <ServiceOrderCompletionModal
          open={isServiceOrderCompletionModalOpen}
          onOpenChange={setIsServiceOrderCompletionModalOpen}
          serviceOrder={selectedServiceOrder}
          onComplete={handleCompleteServiceOrder}
          onPrintAndComplete={handlePrintAndCompleteServiceOrder}
        />
      </div>
    </DndProvider>
  );
}