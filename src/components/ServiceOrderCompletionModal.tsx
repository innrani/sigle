import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CreditCard, Banknote, Smartphone, Building2, CheckCircle2, Printer, AlertCircle } from "lucide-react";
import type { ServiceOrder } from "../types";
import { useState } from "react";
import { calculateWarrantyEndDate, formatDateBR } from "../lib/date-utils";

interface ServiceOrderCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceOrder: ServiceOrder | null;
  onComplete: (serviceOrder: ServiceOrder) => void;
  onPrintAndComplete: (serviceOrder: ServiceOrder) => void;
}

export function ServiceOrderCompletionModal({ 
  open, 
  onOpenChange, 
  serviceOrder,
  onComplete,
  onPrintAndComplete
}: ServiceOrderCompletionModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "pix" | "transfer">("cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState(3);

  if (!serviceOrder) return null;

  const handleComplete = (shouldPrint: boolean) => {
    const completionDate = new Date().toISOString();
    const warrantyStartDate = completionDate;
    const warrantyEndDate = calculateWarrantyEndDate(warrantyStartDate, warrantyMonths);

    const completedServiceOrder: ServiceOrder = {
      ...serviceOrder,
      status: "completed",
      paymentMethod,
      paymentAmount,
      completionDate,
      deliveryDate: completionDate,
      warrantyStartDate,
      warrantyEndDate,
      warrantyMonths,
      updatedAt: completionDate
    };

    if (shouldPrint) {
      onPrintAndComplete(completedServiceOrder);
    } else {
      onComplete(completedServiceOrder);
    }

    // Reset form
    setPaymentAmount("");
    setPaymentMethod("cash");
    setWarrantyMonths(3);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash": return <Banknote className="w-5 h-5" />;
      case "card": return <CreditCard className="w-5 h-5" />;
      case "pix": return <Smartphone className="w-5 h-5" />;
      case "transfer": return <Building2 className="w-5 h-5" />;
      default: return <Banknote className="w-5 h-5" />;
    }
  };

  const warrantyEndDate = calculateWarrantyEndDate(new Date(), warrantyMonths);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Finalizar Ordem de Serviço
          </DialogTitle>
          <DialogDescription>
            O.S #{serviceOrder.osNumber || serviceOrder.id.slice(-4)} - {serviceOrder.clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Equipment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Equipamento</p>
            <p className="font-medium">
              {serviceOrder.device} {serviceOrder.brand} {serviceOrder.model}
            </p>
            <p className="text-sm text-gray-600 mt-2">{serviceOrder.defect}</p>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <div className="col-start-1 col-span-2 flex items-center justify-center gap-2 text-center">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-800">
                Ao finalizar, esta O.S será marcada como <strong>concluída</strong> e entrará 
                automaticamente em <strong>garantia de {warrantyMonths} meses</strong>.
              </span>
            </div>
          </Alert>

          {/* Payment Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-method" className="text-base">
                Forma de Pagamento *
              </Label>
              <Select 
                value={paymentMethod}
                onValueChange={(value: "cash" | "card" | "pix" | "transfer") => setPaymentMethod(value)}
              >
                <SelectTrigger id="payment-method" className="mt-2">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(paymentMethod)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      <span>Dinheiro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pix">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>PIX</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="transfer">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Transferência</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment-amount" className="text-base">
                Valor do Serviço
              </Label>
              <Input
                id="payment-amount"
                type="text"
                placeholder="R$ 0,00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional - será exibido na impressão</p>
            </div>

            <div>
              <Label htmlFor="warranty-months" className="text-base">
                Período de Garantia
              </Label>
              <Select 
                value={warrantyMonths.toString()}
                onValueChange={(value: string) => setWarrantyMonths(parseInt(value))}
              >
                <SelectTrigger id="warranty-months" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 mês</SelectItem>
                  <SelectItem value="2">2 meses</SelectItem>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Garantia válida até: <strong>{formatDateBR(warrantyEndDate)}</strong>
              </p>
            </div>
          </div>

          {/* Warranty Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-900">Garantia Ativada</p>
                <p className="text-green-700 mt-1">
                  O cliente terá garantia de <strong>{warrantyMonths} {warrantyMonths === 1 ? 'mês' : 'meses'}</strong> para este serviço, 
                  válida até <strong>{formatDateBR(warrantyEndDate)}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleComplete(false)}
            className="bg-[#8b7355] hover:bg-[#7a6345] flex-1 sm:flex-initial"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Finalizar
          </Button>
          <Button 
            onClick={() => handleComplete(true)}
            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
          >
            <Printer className="w-4 h-4 mr-2" />
            Finalizar e Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}