// src/App.tsx

import { useState, useEffect } from "react"; 
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

// Services 
import { DatabaseService } from "./services/database"; 

// Types
import type { Client, PageType } from "./types/index"; 

// Components - Modals
import { AddClientModal } from "./components/AddClientModal";
import { EditClientModal } from "./components/EditClientModal";

// Components - Pages
import { MainLayout } from "./components/MainLayout";
import { ClientsPage } from "./components/ClientsPage";

// UI Components
import { Toaster } from "./components/ui/sonner";

export default function App() {
    // 1. ESTADO: Clientes agora são gerenciados e carregados do DB
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(true); 

    // Page navigation state
    const [currentPage, setCurrentPage] = useState<PageType>("main");
    
    // Modal states
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);

    // Edit states
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    // Filter state for the MainLayout sidebar (se você tiver)
    const [searchQuery, setSearchQuery] = useState(""); 
    
    // Filtra apenas os clientes ativos para o MainLayout
    const activeClients = clients.filter(c => c.ativo); 

    // ----------------------------------------------------
    // Lógica de Carregamento Inicial
    // ----------------------------------------------------
    const fetchClients = async () => {
        setIsLoadingClients(true);
        try {
            const fetchedClients = await DatabaseService.listClients();
            setClients(fetchedClients as Client[]); 
        } catch (error) {
            console.error("Erro ao buscar clientes do DB:", error);
            toast.error("Falha ao carregar clientes. Verifique o console do Electron.");
            setClients([]); // Garantir que o array seja um array vazio em caso de falha
        } finally {
            setIsLoadingClients(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []); 

    // ----------------------------------------------------
    // Handlers de Clientes (IPC Callbacks)
    // ----------------------------------------------------

    // 1. Adicionar Cliente (Chamado pelo AddClientModal)
    const handleClientAdded = (newClient: Client) => {
        // Recebe o cliente COMPLETO do modal e adiciona ao estado
        setClients((prevClients) => [...prevClients, newClient]);
    };
    
    // 2. Editar Cliente (Prepara o modal)
    const handleEditClientStart = (client: Client) => {
        setClientToEdit(client);
        setIsEditClientModalOpen(true);
    };

    // 3. Atualizar Cliente (Chamado pelo EditClientModal)
    const handleClientUpdated = (updatedClient: Client) => {
        // Recebe o cliente ATUALIZADO do modal e substitui na lista
        setClients((prevClients) => prevClients.map(c => 
            c.id === updatedClient.id ? updatedClient : c
        ));
    };

    // 4. Deletar Cliente (Chamado pelo ClientsPage)
    const handleClientDeleted = (id: string) => {
        // Remove o cliente da lista pelo ID
        setClients((prevClients) => prevClients.filter(c => c.id !== id));
    };


    // ----------------------------------------------------
    // Renderização
    // ----------------------------------------------------

    return (
        <DndProvider backend={HTML5Backend}>
            <Toaster position="top-right" />
                <div className="h-screen bg-[#f5f0e8] overflow-hidden flex">

                {currentPage === "clients" ? (
                    <ClientsPage
                        onBack={() => setCurrentPage("main")}
                        clients={clients}
                        // Renomeado para refletir o que a função faz (apenas abre o modal)
                        onOpenAddModal={() => setIsClientModalOpen(true)}
                        // Passa a função para iniciar a edição
                        onOpenEditModal={handleEditClientStart} 
                        // Passa o handler para deletar que atualiza o estado
                        onClientDeleted={handleClientDeleted}
                    />
                ) : (
                    <MainLayout
                        clients={activeClients}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        // Passa o handler para abrir o modal
                        onOpenAddModal={() => setIsClientModalOpen(true)} 
                        onNavigateToClients={() => setCurrentPage("clients")}
                    />
                )}

                {/* Modals */}
                <AddClientModal
                    open={isClientModalOpen}
                    onOpenChange={setIsClientModalOpen}
                    onClientAdded={handleClientAdded} // Lida com o sucesso do cadastro
                />

                <EditClientModal
                    open={isEditClientModalOpen}
                    onOpenChange={setIsEditClientModalOpen}
                    client={clientToEdit}
                    onClientUpdated={handleClientUpdated} // Lida com o sucesso da atualização
                />
            </div>
        </DndProvider>
    );
}