import type { Part } from "../types";
import { Button } from "./ui/button";
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from "./ui/table";

interface PartsPageProps {
  onBack: () => void;
  parts: Part[];
  onAddPart: () => void;
  onEditPart: (p: Part) => void;
  onDeletePart: (id: string) => void;
}

export function PartsPage({ onBack, parts, onAddPart, onEditPart, onDeletePart }: PartsPageProps) {
  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Peças</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={onBack}>Voltar</Button>
          <Button onClick={onAddPart}>Adicionar Peça</Button>
        </div>
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
          {parts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.type ?? "-"}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.unit ?? "-"}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>R$ {p.price?.toFixed(2) ?? "-"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => onEditPart(p)}>Editar</Button>
                  <Button variant="destructive" onClick={() => onDeletePart(p.id)}>Excluir</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}