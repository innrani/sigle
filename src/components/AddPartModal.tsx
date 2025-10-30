import { useState } from "react";
import { toast } from "sonner";
import { DatabaseService } from "../services/database";
import { PART_TYPES } from "../lib/constants";

// UI Components
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Keep schema as string-based inputs so react-hook-form types match the form controls.
const partSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  quantity: z.string().regex(/^\d+(?:[.,]\d+)?$/, "Quantidade deve ser um número"),
  price: z.string().regex(/^\d+(?:[.,]\d+)?$/, "Preço deve ser um número"),
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
      type: "",
      name: "",
      description: "",
      quantity: "0",
      price: "0",
    },
  });

  async function onSubmit(data: PartFormData) {
    try {
      setIsSubmitting(true);
      // Convert string inputs to the expected numeric types
      const part = {
        ...data,
        quantity: Number(String(data.quantity).replace(',', '.')),
        price: Number(String(data.price).replace(',', '.')),
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
              name="type"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Tipo de Peça</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Input placeholder="Ex: Lâmpada de Projetor, Cabo HDMI, Placa T-CON" {...field} />
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
                    <Input placeholder="Ex: Compatível com Epson PowerLite, 3 metros" {...field} />
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
                {isSubmitting ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}