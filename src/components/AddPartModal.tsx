import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import type { Part } from "../types";
import { PART_TYPES } from "../lib/constants";

interface AddPartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPart: (part: Part) => void;
}

export function AddPartModal({ open, onOpenChange, onAddPart }: AddPartModalProps) {
  const [formData, setFormData] = useState({
    osNumber: "",
    osDescription: "",
    name: "",
    quantity: "1",
    unit: "",
    status: "to-order" as Part["status"],
    urgent: false,
    price: "",
    orderDate: "",
    expectedDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPart: Part = {
      id: Date.now().toString(),
      name: formData.name,
      osNumber: formData.osNumber,
      osDescription: formData.osDescription,
      quantity: parseInt(formData.quantity),
      unit: formData.unit || "", 
      status: formData.status,
      urgent: formData.urgent,
      price: formData.price || undefined,
      orderDate: formData.orderDate || undefined,
      expectedDate: formData.expectedDate || undefined
    };

    onAddPart(newPart);
    
    // Reset form
    setFormData({
      osNumber: "",
      osDescription: "",
      name: "",
      quantity: "1",
      unit: "",
      status: "to-order",
      urgent: false,
      price: "",
      orderDate: "",
      expectedDate: ""
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Peça</DialogTitle>
          <DialogDescription>
            Adicione uma nova peça ao estoque ou para uma O.S
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part-os">Número da O.S *</Label>
              <Input 
                id="part-os" 
                placeholder="Ex: 1002"
                value={formData.osNumber}
                onChange={(e) => setFormData({...formData, osNumber: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="part-os-desc">Aparelho *</Label>
              <Input 
                id="part-os-desc" 
                placeholder="Ex: TV Samsung"
                value={formData.osDescription}
                onChange={(e) => setFormData({...formData, osDescription: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part-name">Tipo de Peça *</Label>
              {/* TODO: MIGRAÇÃO PARA BD - Carregar de: GET /api/part-types */}
              <Select 
                value={formData.name}
                onValueChange={(value:string) => setFormData({...formData, name: value})}
                required
              >
                <SelectTrigger id="part-name">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PART_TYPES.map((type: string) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="part-unit">Modelo / Número de Série</Label>
              <Input 
                id="part-unit" 
                placeholder="Ex: Samsung U8100F"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-quantity">Quantidade *</Label>
            <Input 
              id="part-quantity" 
              type="number" 
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-status">Status *</Label>
            <Select 
              value={formData.status}
              onValueChange={(value:string ) => setFormData({...formData, status: value as Part["status"]})}
              required
            >
              <SelectTrigger id="part-status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to-order">À Pedir</SelectItem>
                <SelectItem value="ordered">Pedido Realizado</SelectItem>
                <SelectItem value="arriving">À Chegar</SelectItem>
                <SelectItem value="received">Recebido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked: boolean | "indeterminate") => 
                setFormData({...formData, urgent: checked as boolean})}
            />
            <label
              htmlFor="urgent"
              className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Marcar como URGENTE
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-price">Preço (opcional)</Label>
            <Input 
              id="part-price" 
              type="text" 
              placeholder="R$ 0,00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>

          {formData.status !== "to-order" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-date">Data do Pedido</Label>
                <Input 
                  id="order-date" 
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-date">Data Prevista</Label>
                <Input 
                  id="expected-date" 
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#8b7355] hover:bg-[#7a6345]">
              Adicionar Peça
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}