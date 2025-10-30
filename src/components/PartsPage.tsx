import { useState } from "react";
import { Search, Eye } from "lucide-react";
import type { Part } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from "./ui/table";

interface PartsPageProps {
  onBack: () => void;
  parts: Part[];
  onAddPart: () => void;
  onEditPart: (p: Part) => void;
  onDeletePart: (id: string) => void;
}

export function PartsPage({ onBack, parts, onAddPart, onEditPart, onDeletePart }: PartsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPart, setViewPart] = useState<Part | null>(null);

  const filteredParts = parts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.type && part.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Peças</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={onBack}>Voltar</Button>
          <Button onClick={onAddPart}>Adicionar Peça</Button>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="mb-4 flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar por nome ou tipo de peça..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.type ?? "-"}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.unit ?? "-"}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>R$ {p.price?.toFixed(2) ?? "-"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setViewPart(p)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEditPart(p)}>Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeletePart(p.id)}>Excluir</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Visualização */}
      <Dialog open={!!viewPart} onOpenChange={() => setViewPart(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Peça</DialogTitle>
          </DialogHeader>
          {viewPart && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">Tipo:</label>
                <p className="text-sm">{viewPart.type || "Não especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Nome:</label>
                <p className="text-sm">{viewPart.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Unidade:</label>
                <p className="text-sm">{viewPart.unit || "Não especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Quantidade em Estoque:</label>
                <p className="text-sm">{viewPart.quantity}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Preço Unitário:</label>
                <p className="text-sm">R$ {viewPart.price?.toFixed(2) || "Não informado"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Status:</label>
                <p className="text-sm">{viewPart.isActive ? "Ativo" : "Inativo"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}