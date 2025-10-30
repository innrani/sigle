import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, RotateCcw, Plus, Search, Eye, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DatabaseService } from "../services/database";
import { toast } from "sonner";
import { AddEquipmentModal } from "./AddEquipmentModal";
import type { Equipment } from "../types";

interface EquipmentsPageProps {
  onBack: () => void;
}

export function EquipmentsPage({ onBack }: EquipmentsPageProps) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewEquipment, setViewEquipment] = useState<Equipment | null>(null);
  const [editEquipment, setEditEquipment] = useState<Equipment | null>(null);

  const loadEquipments = async () => {
    try {
      setIsLoading(true);
      const data = await DatabaseService.listAllEquipments();
      setEquipments(data);
      setFilteredEquipments(data);
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

  useEffect(() => {
    const filtered = equipments.filter((eq) =>
      eq.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq.serialNumber && eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEquipments(filtered);
  }, [searchTerm, equipments]);

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

      {/* Barra de Busca */}
      <div className="mb-4 flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar por dispositivo, marca, modelo ou serial..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
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
            {filteredEquipments.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.device}</TableCell>
                <TableCell>{e.brand}</TableCell>
                <TableCell>{e.model}</TableCell>
                <TableCell>{e.serialNumber ?? "-"}</TableCell>
                <TableCell>{e.isActive ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewEquipment(e)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditEquipment(e)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {!e.isActive ? (
                      <Button variant="outline" size="sm" onClick={() => handleReactivate(e.id)}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
                        <Trash2 className="w-4 h-4" />
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

      {/* Modal de Visualização */}
      <Dialog open={!!viewEquipment} onOpenChange={() => setViewEquipment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Equipamento</DialogTitle>
          </DialogHeader>
          {viewEquipment && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">Dispositivo:</label>
                <p className="text-sm">{viewEquipment.device}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Marca:</label>
                <p className="text-sm">{viewEquipment.brand}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Modelo:</label>
                <p className="text-sm">{viewEquipment.model}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Número de Série:</label>
                <p className="text-sm">{viewEquipment.serialNumber || "Não informado"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Observações:</label>
                <p className="text-sm">{viewEquipment.notes || "Nenhuma observação"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Status:</label>
                <p className="text-sm">{viewEquipment.isActive ? "Ativo" : "Inativo"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editEquipment} onOpenChange={() => setEditEquipment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Equipamento</DialogTitle>
          </DialogHeader>
          {editEquipment && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Dispositivo</label>
                <Input
                  value={editEquipment.device}
                  onChange={(e) => setEditEquipment({ ...editEquipment, device: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Marca</label>
                <Input
                  value={editEquipment.brand}
                  onChange={(e) => setEditEquipment({ ...editEquipment, brand: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Modelo</label>
                <Input
                  value={editEquipment.model}
                  onChange={(e) => setEditEquipment({ ...editEquipment, model: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Número de Série</label>
                <Input
                  value={editEquipment.serialNumber || ""}
                  onChange={(e) => setEditEquipment({ ...editEquipment, serialNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Observações</label>
                <Input
                  value={editEquipment.notes || ""}
                  onChange={(e) => setEditEquipment({ ...editEquipment, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditEquipment(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await DatabaseService.updateEquipment(Number(editEquipment.id), editEquipment);
                      toast.success("Equipamento atualizado com sucesso!");
                      setEditEquipment(null);
                      await loadEquipments();
                    } catch (err) {
                      toast.error("Erro ao atualizar equipamento.");
                    }
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
       