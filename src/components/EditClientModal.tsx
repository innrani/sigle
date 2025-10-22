// src/components/EditClientModal.tsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Client } from "../types/index"; // <--- Ajuste o caminho
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { DatabaseService } from "../services/database"; // <--- Importa o serviço de DB

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  // Prop renomeada
  onClientUpdated: (client: Client) => void; 
}

const emptyClient: Client = {
    id: "",
    name: "",
    phone: "",
    email: null,
    cpf: null,
    address: null,
    city: null,
    state: null,
    zipCode: null,
    observations: null,
    ativo: true,
    createdAt: "",
    updatedAt: "",
};

export function EditClientModal({ open, onOpenChange, client, onClientUpdated }: EditClientModalProps) {
  const [formData, setFormData] = useState<Client>(emptyClient);
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para carregar os dados do cliente selecionado
  useEffect(() => {
    if (client) {
      // Preenche o formulário com os dados do cliente, garantindo que campos nulos/vazios
      // sejam strings vazias no estado local para melhor UX/controle de formulário.
      setFormData({
        ...client,
        email: client.email || "",
        cpf: client.cpf || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        observations: client.observations || "",
      });
    } else {
        setFormData(emptyClient); // Reset se fechar
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ 
          ...prev, 
          [id]: id === 'state' ? value.toUpperCase() : value 
      }) as Client);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return; // Não deve acontecer, mas é uma segurança
    
    setIsLoading(true);

    // Mapeia de volta para o formato que o DB espera: strings vazias para NULL
    const updatedClientPayload: Client = {
        ...formData,
        email: formData.email || null,
        cpf: formData.cpf || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        zipCode: formData.zipCode || null,
        observations: formData.observations || null,
    }

    try {
      // Chama o IPC e espera o cliente atualizado retornado pelo DB
      const updatedClient = await DatabaseService.updateClient(updatedClientPayload);
      
      if (updatedClient) {
          onClientUpdated(updatedClient); // Notifica o App.tsx para atualizar a lista
      } else {
          throw new Error("Cliente não retornado do banco de dados.");
      }
      
      onOpenChange(false);
      
    } catch (error) {
      console.error("Erro ao atualizar cliente via IPC:", error);
      toast.error("Falha ao salvar alterações.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente (ID: {formData.id})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo *</Label>
              <Input 
                id="name" 
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone *</Label>
              <Input 
                id="phone" 
                placeholder="(99) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Email e CPF */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input id="email" type="email" placeholder="exemplo@email.com" value={formData.email || ""} onChange={handleChange} required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF *</Label>
              <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf || ""} onChange={handleChange} />
            </div>
          </div>
          
          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Endereço *</Label>
            <Input id="address" placeholder="Rua, número, bairro" value={formData.address || ""} onChange={handleChange} required/>
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-city">Cidade *</Label>
              <Input id="city" placeholder="São Paulo" value={formData.city || ""} onChange={handleChange} required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-state">Estado *</Label>
              <Input id="state" placeholder="SP" maxLength={2} value={formData.state || ""} onChange={handleChange} required/>
            </div>
          </div>
          
          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <textarea
              id="observations"
              rows={3}
              placeholder="Notas importantes sobre o cliente..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.observations || ""}
              onChange={handleChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#8b7355] hover:bg-[#7a6345]" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}