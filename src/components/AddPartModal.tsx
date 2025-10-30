import { useState } from "react";
import { toast } from "sonner";
import { DatabaseService } from "../services/database";

// UI Components
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const partSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  quantity: z.string().transform(Number).refine((n) => n >= 0, "Quantidade deve ser maior ou igual a 0"),
  price: z.string().transform((val) => parseFloat(val.replace(",", "."))).refine((n) => n >= 0, "Preço deve ser maior ou igual a 0"),
});

type PartFormData = z.infer<typeof partSchema>;

interface AddPartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPart: (part: any) => void;
}

export function AddPartModal({ open, onOpenChange, onAddPart }: AddPartModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: "0",
      price: "0",
    },
  });

  async function onSubmit(data: PartFormData) {
    try {
      setIsSubmitting(true);
      
      const part = {
        ...data,
        quantity: Number(data.quantity),
        price: Number(data.price),
      };

      await DatabaseService.createPart(part);
      onAddPart(part);
      form.reset();
      onOpenChange(false);
      toast.success("Peça adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar peça:", error);
      toast.error("Erro ao adicionar peça. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Peça</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
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
              render={({ field }) => (
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
              render={({ field }) => (
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
              render={({ field }) => (
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
                {isSubmitting ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}