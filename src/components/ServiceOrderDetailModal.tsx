import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, User, Wrench, Package, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { ServiceOrder, Client, Technician } from "../types";
import { useState, useEffect } from "react";
import { formatDateBR } from "../lib/date-utils";

interface ServiceOrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceOrder: ServiceOrder | null;
  clients: Client[];
  technicians: Technician[];
  onUpdateServiceOrder: (serviceOrder: ServiceOrder) => void;
  onMarkAsReady: (serviceOrder: ServiceOrder) => void;
}

export function ServiceOrderDetailModal({ 
  open, 
  onOpenChange, 
  serviceOrder,
  clients,
  technicians,
  onUpdateServiceOrder,
  onMarkAsReady
}: ServiceOrderDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    device: "",
    brand: "",
    model: "",
    serialNumber: "",
    color: "",
    accessories: "",
    defect: "",
    observations: "",
    status: "pending" as ServiceOrder["status"],
    technicianId: "",
    priority: "normal" as "normal" | "urgent" | "low"
  });

  // Update form when serviceOrder changes
  useEffect(() => {
    if (serviceOrder) {
      setFormData({
        device: serviceOrder.device || "",
        brand: serviceOrder.brand || "",
        model: serviceOrder.model || "",
        serialNumber: serviceOrder.serialNumber || "",
        color: serviceOrder.color || "",
        accessories: serviceOrder.accessories || "",
        defect: serviceOrder.defect || "",
        observations: serviceOrder.observations || "",
        status: serviceOrder.status,
        technicianId: serviceOrder.technicianId || "",
        priority: serviceOrder.priority || "normal"
      });
    }
  }, [serviceOrder]);

  if (!serviceOrder) return null;

  const handleSave = () => {
    const selectedTechnician = technicians.find(t => t.id === formData.technicianId);
    
    const updatedServiceOrder: ServiceOrder = {
      ...serviceOrder,
      device: formData.device,
      brand: formData.brand,
      model: formData.model,
      serialNumber: formData.serialNumber || undefined,
      color: formData.color || undefined,
      accessories: formData.accessories || undefined,
      defect: formData.defect,
      observations: formData.observations,
      status: formData.status,
      technicianId: formData.technicianId,
      technicianName: selectedTechnician?.name || serviceOrder.technicianName,
      priority: formData.priority,
      updatedAt: new Date().toISOString()
    };

    onUpdateServiceOrder(updatedServiceOrder);
    setIsEditing(false);
  };

  const handleMarkAsReady = () => {
    onMarkAsReady(serviceOrder);
  };

  const getStatusBadge = (status: ServiceOrder["status"]) => {
    const statusConfig = {
      "pending": { label: "Pendente", variant: "secondary" as const },
      "in-progress": { label: "Em Andamento", variant: "default" as const },
      "waiting-parts": { label: "Aguardando Peças", variant: "outline" as const },
      "completed": { label: "Concluído", variant: "default" as const },
      "cancelled": { label: "Cancelado", variant: "destructive" as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority || priority === "normal") return null;
    
    const priorityConfig = {
      "urgent": { label: "URGENTE", className: "bg-red-100 text-red-700 border-red-300" },
      "low": { label: "Baixa", className: "bg-gray-100 text-gray-700 border-gray-300" }
    };
    
    const config = priorityConfig[priority as "urgent" | "low"];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                O.S #{serviceOrder.osNumber || serviceOrder.id.slice(-4)}
              </DialogTitle>
              <DialogDescription>
                Criada em {formatDateBR(serviceOrder.createdAt)}
                {serviceOrder.updatedAt && ` • Atualizada em ${formatDateBR(serviceOrder.updatedAt)}`}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(serviceOrder.status)}
              {getPriorityBadge(serviceOrder.priority)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4" />
              <span>Informações do Cliente</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Nome</Label>
                  <p className="font-medium">{serviceOrder.clientName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Telefone</Label>
                  <p className="font-medium">
                    {clients.find(c => c.id === serviceOrder.clientId)?.phone || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Equipment Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4" />
              <span>Equipamento</span>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="device">Aparelho *</Label>
                    <Input
                      id="device"
                      value={formData.device}
                      onChange={(e) => setFormData({...formData, device: e.target.value})}
                      placeholder="Ex: TV"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      placeholder="Ex: Samsung"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      placeholder="Ex: UN55TU8000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serialNumber">Número de Série</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                      placeholder="Ex: SN123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      placeholder="Ex: Preto"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accessories">Acessórios</Label>
                  <Input
                    id="accessories"
                    value={formData.accessories}
                    onChange={(e) => setFormData({...formData, accessories: e.target.value})}
                    placeholder="Ex: Cabo, Caixa, Controle"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-medium">
                  {serviceOrder.device} {serviceOrder.brand} {serviceOrder.model}
                </p>
                {(serviceOrder.serialNumber || serviceOrder.color || serviceOrder.accessories) && (
                  <div className="text-sm text-gray-700 space-y-1 pt-2 border-t border-gray-200">
                    {serviceOrder.serialNumber && (
                      <p><span className="text-gray-600">N° Série:</span> {serviceOrder.serialNumber}</p>
                    )}
                    {serviceOrder.color && (
                      <p><span className="text-gray-600">Cor:</span> {serviceOrder.color}</p>
                    )}
                    {serviceOrder.accessories && (
                      <p><span className="text-gray-600">Acessórios:</span> {serviceOrder.accessories}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Service Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Wrench className="w-4 h-4" />
              <span>Informações do Serviço</span>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="technician">Técnico Responsável *</Label>
                  <Select 
                    value={formData.technicianId}
                    onValueChange={(value: string) => setFormData({...formData, technicianId: value})}
                  >
                    <SelectTrigger id="technician">
                      <SelectValue placeholder="Selecione o técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defect">Defeito Relatado *</Label>
                  <Textarea
                    id="defect"
                    value={formData.defect}
                    onChange={(e) => setFormData({...formData, defect: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status}
                      onValueChange={(value: ServiceOrder["status"]) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in-progress">Em Andamento</SelectItem>
                        <SelectItem value="waiting-parts">Aguardando Peças</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select 
                      value={formData.priority}
                      onValueChange={(value: "normal" | "urgent" | "low") => setFormData({...formData, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">Técnico Responsável</Label>
                  <p className="font-medium">{serviceOrder.technicianName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Defeito Relatado</Label>
                  <p>{serviceOrder.defect}</p>
                </div>
                {serviceOrder.observations && (
                  <div>
                    <Label className="text-xs text-gray-600">Observações</Label>
                    <p className="text-sm text-gray-700">{serviceOrder.observations}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Entry Date */}
          {serviceOrder.entryDate && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Data de Entrada:</span>
                <span className="font-medium">{formatDateBR(serviceOrder.entryDate)}</span>
              </div>
            </>
          )}

          {/* Warranty Information (if completed) */}
          {serviceOrder.status === "completed" && serviceOrder.warrantyEndDate && (
            <>
              <Separator />
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-800 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Garantia Ativa</span>
                </div>
                <div className="text-sm text-green-700">
                  <p>Válida até: <strong>{formatDateBR(serviceOrder.warrantyEndDate)}</strong></p>
                  {serviceOrder.paymentMethod && (
                    <p>Pagamento: <strong>{serviceOrder.paymentMethod.toUpperCase()}</strong></p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {!isEditing && serviceOrder.status !== "completed" && serviceOrder.status !== "cancelled" && (
              <Button 
                onClick={handleMarkAsReady}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar como Pronto
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-[#8b7355] hover:bg-[#7a6345]">
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fechar
                </Button>
                {serviceOrder.status !== "completed" && serviceOrder.status !== "cancelled" && (
                  <Button onClick={() => setIsEditing(true)} className="bg-[#8b7355] hover:bg-[#7a6345]">
                    Editar O.S
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}