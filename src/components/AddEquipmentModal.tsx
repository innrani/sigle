import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { DatabaseService } from "../services/database";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";

const equipmentSchema = z.object({
  device: z.string().min(1, "Dispositivo é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  serialNumber: z.string().optional(),
  accessories: z.array(z.string()).optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface AddEquipmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEquipmentModal({ open, onClose, onSuccess }: AddEquipmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parts, setParts] = useState<any[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      device: "",
      brand: "",
      model: "",
      serialNumber: "",
    },
  });

  // load parts for accessories list when modal is opened
  useLoadParts(setParts, open);

  async function onSubmit(data: EquipmentFormData) {
    try {
      setIsSubmitting(true);
      const payload = { ...data, accessories: selectedAccessories } as any;
      await DatabaseService.addEquipment(payload);
      toast.success("Equipamento cadastrado com sucesso!");
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar equipamento:", error);
      toast.error("Erro ao cadastrar equipamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Equipamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="device"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Dispositivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Projetor, TV LED, TV LCD" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Epson, Samsung, LG, Sony, BenQ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PowerLite X49, UN55TU8000, 43UN7300" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Número de Série (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de série do equipamento" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Acessórios: lista de peças (checkboxes) */}
            <div>
              <label className="text-sm font-semibold block mb-2">Acessórios (opcional)</label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-auto border rounded p-2">
                {parts.length === 0 ? (
                  <div className="text-sm text-gray-500">Nenhuma peça disponível</div>
                ) : (
                  parts.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedAccessories.includes(p.id)}
                        onCheckedChange={(checked: any) => {
                          const isChecked = Boolean(checked);
                          setSelectedAccessories((prev) =>
                            isChecked ? [...prev, p.id] : prev.filter((id) => id !== p.id)
                          );
                        }}
                      />
                      <span>{p.name} {p.type ? `(${p.type})` : ""}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// load parts when modal opens
function useLoadParts(setParts: (p: any[]) => void, open: boolean) {
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    DatabaseService.listParts()
      .then((list) => {
        if (mounted) setParts(list || []);
      })
      .catch((e) => {
        console.error('Erro ao carregar peças para acessórios', e);
        setParts([]);
      });
    return () => { mounted = false; };
  }, [open, setParts]);
}
