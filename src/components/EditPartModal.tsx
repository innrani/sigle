import { useState } from "react";
import { toast } from "sonner";
import { DatabaseService } from "../services/database";
import { PART_TYPES } from "../lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI Components
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FormValues {
  type: string;
  name: string;
  description?: string;
  quantity: string;
  price: string;
}

interface Part {
  id: string;
  type?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

const partSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  quantity: z.string(),
  price: z.string(),
});

interface Part {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface EditPartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part | null;
  onEditPart: (part: Part) => void;
}

export function EditPartModal({ open, onOpenChange, part, onEditPart }: EditPartModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      type: part?.type ?? "",
      name: part?.name ?? "",
      description: part?.description ?? "",
      quantity: part?.quantity.toString() ?? "0",
      price: part?.price.toString() ?? "0",
    },
  });

  async function onSubmit(data: FormValues) {
    if (!part) return;

    try {
      setIsSubmitting(true);
      
      const updatedPart = {
        ...part,
        ...data,
        quantity: Number(data.quantity),
        price: Number(data.price),
      };

      await DatabaseService.updatePart(updatedPart);
      onEditPart(updatedPart);
      form.reset();
      onOpenChange(false);
      toast.success("Peça atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar peça:", error);
      toast.error("Erro ao atualizar peça. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Peça</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Tipo de Peça</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de peça" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PART_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da peça" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da peça" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="Quantidade em estoque" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="Preço da peça" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}