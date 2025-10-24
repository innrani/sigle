// src/components/ClientsPage.tsx

import { ArrowLeft, Search, Plus, Pencil, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Usar o toast para feedback
import type { Client } from "../types/index"; // <--- Ajuste o caminho
import { Button } from "./ui/button";
import { DatabaseService } from "../services/database"; // <--- Importa o serviço de DB
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ClientsPageProps {
  onBack: () => void;
  clients: Client[];
  // Renomeado: Agora é apenas para abrir o modal
  onOpenAddModal: () => void;
  // Renomeado: Agora é para preparar a edição
  onOpenEditModal: (client: Client) => void;
  // Novo: Callback para App.tsx após a exclusão bem-sucedida
  onClientDeleted: (id: string) => void;
  // NOVO: Adicionar as props para o filtro de inativos
  showInactive: boolean; // Tipo boolean para o estado do checkbox
  onToggleShowInactive: (show: boolean) => void;
  onClientReactivated: (client_id: string) => void | Promise<void>;
  isLoading: boolean;
}

export function ClientsPage({ onBack, clients, onOpenAddModal, onOpenEditModal, onClientDeleted, showInactive, onToggleShowInactive }: ClientsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null);

  // SUBSTITUA a função handleDeleteClient
  const handleDeleteClient = async (client_id: string) => {
    try {
      // 1. CHAMA O BACKEND PARA DELETAR
      const result = await DatabaseService.deleteClient(client_id);

      // 2. Notifica o App.tsx para remover o cliente do estado local
      onClientDeleted(client_id);

      // 3. Exibe a mensagem de sucesso com a resposta do Soft Delete
      toast.success(result.message);

    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao deletar cliente.";
      toast.error(errorMessage);
    } finally {
      // ⚠️ CORREÇÃO DO TRAVAMENTO: Zera o estado para fechar o modal e liberar a tela
      setClientToDeleteId(null);
    }
  };

  const handleReactivateClient = async (client_id: string) => {
  try {
    const result = await DatabaseService.reactivateClient(client_id);
    toast.success(result.message);

    // Atualiza a lista após reativar
    onClientDeleted(client_id); // pode ser renomeado depois para algo mais genérico, tipo onClientUpdated

  } catch (error) {
    console.error("Erro ao reativar cliente:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao reativar cliente.";
    toast.error(errorMessage);
  }
};



 const filteredClients = clients
  .filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      (client.name || '').toLowerCase().includes(query) ||
      (client.phone || '').toLowerCase().includes(query) ||
      (client.email || '').toLowerCase().includes(query) ||
      (client.cpf || '').toLowerCase().includes(query)
    );
  })
  .sort((a, b) => {
    // Clientes is_active primeiro
    if (a.is_active === b.is_active) return 0;
    return a.is_active ? -1 : 1;
  });

  return (
    <div className="flex-1 bg-[#f5f0e8] h-screen overflow-hidden flex flex-col">
      {/* Sticky Header with Back Button and Title */}
      <div className="sticky top-0 bg-[#f5f0e8] z-20 pb-4 pt-6 px-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            style={{
              fontFamily: 'Lexend Deca, sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            GERENCIAMENTO DE CLIENTES
          </h1>


        </div>



        {/* Search Bar and Add Button */}
        <div className="max-w-[500px] mx-auto">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
            <input
              type="text"
              placeholder="Buscar cliente por nome, telefone ou CPF..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:border-[#8b7355] transition-colors shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              onClick={onOpenAddModal}
              className="bg-[#8b7355] hover:bg-[#7a6345] text-white rounded-full px-6 py-2 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>

            {/* Checkbox à direita do botão */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-inactive"
                checked={showInactive}
                onChange={(e) => onToggleShowInactive(e.target.checked)}
                className="w-4 h-4 text-gray-800 bg-gray-100 border-gray-300 rounded focus:ring-gray-500"
              />
              <label htmlFor="show-inactive" className="text-sm font-medium text-gray-900">
                Mostrar Inativos
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Clients List */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {filteredClients.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">Nenhum cliente encontrado</p>
            <p className="text-sm mt-2">
              {searchQuery ? "Tente outra pesquisa" : "Cadastre seu primeiro cliente"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-gray-300 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Header and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${client.is_active ? 'text-gray-800' : 'text-red-500'}`}>
                    {client.name}
                    {!client.is_active && <span className="text-sm font-normal ml-3">(Inativo)</span>}
                  </h2>
                  <div className="flex gap-2">
  {/* Botão editar (sempre visível) */}
  <button
    onClick={() => onOpenEditModal(client)}
    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
    title="Editar cliente"
  >
    <Pencil className="w-4 h-4 text-gray-600" />
  </button>

  {/* Se o cliente estiver ativo → mostra o botão de excluir */}
  {client.is_active ? (
    <button
      onClick={() => setClientToDeleteId(client.id)}
      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      title="Excluir cliente"
    >
      <Trash2 className="w-4 h-4 text-red-600" />
    </button>
  ) : (
    /* Se estiver inativo → mostra o botão de reativar */
    <button
      onClick={() => handleReactivateClient(client.id)}
      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      title="Reativar cliente"
    >
      <ArrowLeft className="w-4 h-4 text-green-600 rotate-180" /> {/* Ícone "voltar" virado vira um símbolo de reativação */}
    </button>
  )}
</div>

                </div>

                {/* Client Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{client.phone}</span>
                  </div>

                  {client.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{client.email}</span>
                    </div>
                  )}

                  {(client.address || client.city) && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-700">
                        {client.address && <>{client.address}</>}
                        {client.city && client.address && <>, </>}
                        {client.city && <>{client.city}</>}
                        {client.state && <> - {client.state}</>}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* ⚠️ MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (AlertDialog) ⚠️ */}
            <AlertDialog open={!!clientToDeleteId} onOpenChange={(open: boolean) => !open && setClientToDeleteId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você está prestes a deletar um cliente. Se este cliente tiver ordens de serviço (OS) registradas, ele será apenas **inativado** (Exclusão Lógica) para preservar o histórico. Caso contrário, será excluído permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    // Chama a exclusão se houver um ID no estado
                    onClick={() => clientToDeleteId && handleDeleteClient(clientToDeleteId)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirmar Exclusão
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
