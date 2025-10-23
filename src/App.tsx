// src/App.tsx
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { DatabaseService } from "./services/database";
import type { Client, PageType } from "./types/index";
import { AddClientModal } from "./components/AddClientModal";
import { EditClientModal } from "./components/EditClientModal";
import { MainLayout } from "./components/MainLayout";
import { ClientsPage } from "./components/ClientsPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(true);
    const [currentPage, setCurrentPage] = useState<PageType>("main");
    const [showInactive, setShowInactive] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Função para carregar todos os clientes
    const fetchClients = async () => {
        try {
            setIsLoadingClients(true);
            const allClients = await DatabaseService.listAllClients();
            setClients(allClients);
        } catch (error) {
            toast.error("Erro ao carregar clientes.");
            console.error(error);
        } finally {
            setIsLoadingClients(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Atualiza o estado sempre que algo for alterado no banco
    const refreshClients = async () => {
        try {
            const updated = await DatabaseService.listAllClients();
            setClients(updated);
        } catch (err) {
            console.error("Erro ao atualizar lista de clientes:", err);
        }
    };

    // Quando adiciona um cliente
    const handleClientAdded = async () => {
        await refreshClients();
    };

    // Quando inicia a edição
    const handleEditClientStart = (client: Client) => {
        setClientToEdit(client);
        setIsEditClientModalOpen(true);
    };

    // Quando atualiza um cliente
    const handleClientUpdated = async () => {
        await refreshClients();
    };

    // Quando deleta (ou inativa) um cliente
    const handleClientDeleted = async () => {
        await refreshClients();
    };

    // Quando reativa um cliente
    const handleClientReactivated = async () => {
        await refreshClients();
    };

    const clientsToDisplay = showInactive
        ? clients
        : clients.filter((c) => c.is_active);

    const activeClients = clients.filter((c) => c.is_active);

    return (
        <DndProvider backend={HTML5Backend}>
            <Toaster position="top-right" />
            <div className="h-screen bg-[#f5f0e8] overflow-hidden flex">
                {currentPage === "clients" ? (
                    <ClientsPage
                        onBack={() => setCurrentPage("main")}
                        clients={clientsToDisplay}
                        showInactive={showInactive}
                        onToggleShowInactive={setShowInactive}
                        onOpenAddModal={() => setIsClientModalOpen(true)}
                        onOpenEditModal={handleEditClientStart}
                        onClientDeleted={handleClientDeleted}
                        onClientReactivated={handleClientReactivated} // <--- NOVO
                        isLoading={isLoadingClients}
                    />
                ) : (
                    <MainLayout
                        clients={activeClients}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onOpenAddModal={() => setIsClientModalOpen(true)}
                        onNavigateToClients={() => setCurrentPage("clients")}
                    />
                )}

                {/* Modais */}
                <AddClientModal
                    open={isClientModalOpen}
                    onOpenChange={setIsClientModalOpen}
                    onClientAdded={handleClientAdded}
                />

                <EditClientModal
                    open={isEditClientModalOpen}
                    onOpenChange={setIsEditClientModalOpen}
                    client={clientToEdit}
                    onClientUpdated={handleClientUpdated}
                />
            </div>
        </DndProvider>
    );
}
