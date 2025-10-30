// src/components/AddClientModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import type { Client, NewClient } from "../types/index"; 
import { DatabaseService } from "../services/database"; 

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Prop renomeada para refletir o evento de sucesso após o DB
  onClientAdded: (client: Client) => void; 
}

const initialFormData: NewClient = {
    name: "",
    phone: "",
    email: null,
    cpf: null,
    address: null,
    city: null,
    state: null,    
    observations: null,
};

export function AddClientModal({ open, onOpenChange, onClientAdded }: AddClientModalProps) {
  // O estado usa o tipo NewClient (o payload do formulário)
  const [formData, setFormData] = useState<NewClient>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ 
          ...prev, 
          [id]: id === 'state' ? value.toUpperCase() : value 
      }) as NewClient); // Typecast para garantir o tipo NewClient
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mapeia os campos para garantir que strings vazias sejam enviadas como NULL
    const clientPayload: NewClient = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null, 
      cpf: formData.cpf || null,
      address: formData.address || null,
      city: formData.city || null,
      state: formData.state || null,      
      observations: formData.observations || null,
    };
    
    try {
      // Chama o IPC e espera o cliente completo retornado pelo DB
      const addedClient = await DatabaseService.addClient(clientPayload);
      
      if (addedClient) {
        onClientAdded(addedClient); 
        toast.success("Cliente cadastrado com sucesso!");
      } else {
         throw new Error("Cliente não retornado do banco de dados.");
      }
      
      setFormData(initialFormData); // Reset form
      onOpenChange(false);
      
    } catch (error) {
      console.error("Erro ao adicionar cliente via IPC:", error);
      toast.error("Falha ao cadastrar cliente.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Instituição</DialogTitle>
          <DialogDescription>
            Preencha os dados da instituição (escola, colégio, instituto) para cadastro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Instituição *</Label>
              <Input 
                id="name" 
                placeholder="Ex: Escola Municipal Centro, IFBA Campus Salvador"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input 
                id="phone" 
                placeholder="(99) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="contato@escola.edu.br"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CNPJ (opcional)</Label>
              <Input 
                id="cpf" 
                placeholder="00.000.000/0000-00"
                value={formData.cpf || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input 
              id="address" 
              placeholder="Rua, número, bairro"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input 
                id="city" 
                placeholder="Cidade"
                value={formData.city || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input 
                id="state" 
                placeholder="UF" 
                maxLength={2}
                value={formData.state || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <textarea
              id="observations"
              rows={3}
              placeholder="Ex: Projetor da sala 12, TV 55 polegadas da biblioteca..."
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
              {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}