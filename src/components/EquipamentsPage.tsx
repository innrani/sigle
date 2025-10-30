import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, RotateCcw, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from "./ui/table";
import { DatabaseService } from "../services/database";
import { toast } from "sonner";
import { AddEquipmentModal } from "./AddEquipmentModal";
import type { Equipment } from "../types";

interface EquipmentsPageProps {
  onBack: () => void;
}

export function EquipmentsPage({ onBack }: EquipmentsPageProps) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadEquipments = async () => {
    try {
      setIsLoading(true);
      const data = await DatabaseService.listAllEquipments();
      setEquipments(data);
    } catch (err) {
      console.error("Erro ao carregar equipamentos:", err);
      toast.error("Erro ao carregar equipamentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja inativar/remover este equipamento?")) return;
    try {
      // DatabaseService expects a numeric id for equipment handlers in this project
      const numericId = Number(id);
      await DatabaseService.deleteEquipment(numericId);
      toast.success("Equipamento inativado com sucesso");
      await loadEquipments();
    } catch (err) {
      console.error("Erro ao deletar equipamento:", err);
      toast.error("Erro ao inativar equipamento.");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      const numericId = Number(id);
      await DatabaseService.reactivateEquipment(numericId);
      toast.success("Equipamento reativado com sucesso");
      await loadEquipments();
    } catch (err) {
      console.error("Erro ao reativar equipamento:", err);
      toast.error("Erro ao reativar equipamento.");
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h2 className="text-xl font-semibold">Equipamentos</h2>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Equipamento
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-600">Carregando equipamentos...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipments.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.device}</TableCell>
                <TableCell>{e.brand}</TableCell>
                <TableCell>{e.model}</TableCell>
                <TableCell>{e.serialNumber ?? "-"}</TableCell>
                <TableCell>{e.isActive ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!e.isActive ? (
                      <Button variant="outline" size="sm" onClick={() => handleReactivate(e.id)}>
                        <RotateCcw className="w-4 h-4" /> Reativar
                      </Button>
                    ) : (
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
                        <Trash2 className="w-4 h-4" /> Inativar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AddEquipmentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadEquipments}
      />
    </div>
  );
}
       