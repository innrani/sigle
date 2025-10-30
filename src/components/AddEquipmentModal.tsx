import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { DatabaseService } from "../services/database";
import { toast } from "sonner";

const equipmentSchema = z.object({
  device: z.string().min(1, "Dispositivo é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  serialNumber: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface AddEquipmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEquipmentModal({ open, onClose, onSuccess }: AddEquipmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      device: "",
      brand: "",
      model: "",
      serialNumber: "",
    },
  });

  async function onSubmit(data: EquipmentFormData) {
    try {
      setIsSubmitting(true);
      await DatabaseService.addEquipment(data);
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
                    <Input placeholder="Ex: Notebook, Desktop, Impressora" {...field} />
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
                    <Input placeholder="Ex: Dell, HP, Lenovo" {...field} />
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
                    <Input placeholder="Ex: Inspiron 15, ThinkPad X1" {...field} />
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
