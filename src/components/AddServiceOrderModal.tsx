import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Search, Settings } from "lucide-react";
import type { Client, ServiceOrder, Technician } from "../types";
import { useState, useEffect } from "react";

interface AddServiceOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  technicians: Technician[];
  activeTechnicianId?: string | null;
  onCreateServiceOrder: (serviceOrder: ServiceOrder) => void;
  preSelectedClient?: Client | null;
}

export function AddServiceOrderModal({ open, onOpenChange, clients, technicians, activeTechnicianId, onCreateServiceOrder, preSelectedClient }: AddServiceOrderModalProps) {
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [formData, setFormData] = useState({
    device: "",
    brand: "",
    model: "",
    serialNumber: "",
    color: "",
    accessories: "",
    technician: "",
    entryDate: "",
    problem: "",
    estimate: "",
    priority: "normal" as "normal" | "urgent" | "low"
  });

  // Effect to set pre-selected client
  useEffect(() => {
    if (preSelectedClient) {
      setSelectedClient(preSelectedClient);
      setClientSearch(preSelectedClient.name);
    }
  }, [preSelectedClient]);

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.includes(clientSearch)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      alert("Por favor, selecione um cliente");
      return;
    }

    if (!formData.technician) {
      alert("Por favor, selecione um técnico");
      return;
    }

    // Generate OS number
    const osNumber = `${Date.now().toString().slice(-4)}`;
    
    const newServiceOrder: ServiceOrder = {
      id: Date.now().toString(),
      osNumber: osNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      technicianId: technicians.find(t => t.name === formData.technician)?.id || "",
      technicianName: formData.technician,
      createdByTechnicianId: activeTechnicianId || undefined,
      device: formData.device,
      brand: formData.brand,
      model: formData.model,
      serialNumber: formData.serialNumber || undefined,
      color: formData.color || undefined,
      accessories: formData.accessories || undefined,
      defect: formData.problem,
      observations: formData.estimate,
      status: "pending",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateServiceOrder(newServiceOrder);
    
    // Reset all states
    resetForm();
    
    onOpenChange(false);
  };

  const resetForm = () => {
    setClientSearch("");
    setSelectedClient(null);
    setFormData({
      device: "",
      brand: "",
      model: "",
      serialNumber: "",
      color: "",
      accessories: "",
      technician: "",
      entryDate: "",
      problem: "",
      estimate: "",
      priority: "normal"
    });
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  // Reset form when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
          <DialogDescription>
            {preSelectedClient ? (
              <span>Criando O.S para <strong>{preSelectedClient.name}</strong></span>
            ) : (
              "Preencha os dados para criar uma nova ordem de serviço"
            )}
          </DialogDescription>
        </DialogHeader>
        <form id="create-os-form" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-search">Cliente *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <Input
                  id="client-search"
                  placeholder="Pesquisar cliente..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                    setSelectedClient(null);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className={`pl-10 ${preSelectedClient ? 'bg-green-50 border-green-300' : ''}`}
                  required
                />
                {showClientDropdown && clientSearch && !selectedClient && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.phone}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Nenhum cliente encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
              {preSelectedClient && selectedClient && (
                <p className="text-xs text-green-600">✓ Cliente recém-cadastrado selecionado</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device">Aparelho *</Label>
              <Input 
                id="device" 
                placeholder="Ex: TV"
                value={formData.device}
                onChange={(e) => setFormData({...formData, device: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input 
                id="brand" 
                placeholder="Ex: Samsung"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input 
                id="model" 
                placeholder="Ex: UN55TU8000"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Série</Label>
              <Input 
                id="serialNumber" 
                placeholder="Ex: SN123456789"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor do Produto</Label>
              <Input 
                id="color" 
                placeholder="Ex: Preto, Branco, Prata"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessories">Acessórios que vieram com o produto</Label>
            <Input 
              id="accessories" 
              placeholder="Ex: Cabo de alimentação, Caixa, Controle remoto, Manual"
              value={formData.accessories}
              onChange={(e) => setFormData({...formData, accessories: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Técnico Responsável *</Label>
              <Select 
                value={formData.technician}
                onValueChange={(value: string) => setFormData({...formData, technician: value})}
                required
              >
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.name}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data de Entrada *</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({...formData, entryDate: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problema Relatado *</Label>
            <Textarea 
              id="problem" 
              placeholder="Descreva o problema..." 
              rows={3}
              value={formData.problem}
              onChange={(e) => setFormData({...formData, problem: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimate">Orçamento Estimado</Label>
              <Input 
                id="estimate" 
                type="text" 
                placeholder="R$ 0,00"
                value={formData.estimate}
                onChange={(e) => setFormData({...formData, estimate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "normal" | "urgent" | "low") => setFormData({...formData, priority: value})}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="create-os-form" className="bg-[#8b7355] hover:bg-[#7a6345]">
            Criar O.S
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}