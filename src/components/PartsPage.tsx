import { ArrowLeft, Search, Plus, Pencil, Trash2, AlertCircle, Package } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Part } from "../types";

interface PartsPageProps {
  onBack: () => void;
  parts: Part[];
  onAddPart: () => void;
  onEditPart: (part: Part) => void;
  onDeletePart: (id: string) => void;
}

const statusConfig = {
  "to-order": { label: "À Pedir", color: "bg-red-100 text-red-800 border-red-300" },
  "ordered": { label: "Pedido Realizado", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  "arriving": { label: "À Chegar", color: "bg-blue-100 text-blue-800 border-blue-300" },
  "received": { label: "Recebido", color: "bg-green-100 text-green-800 border-green-300" },
};

export function PartsPage({ onBack, parts, onAddPart, onEditPart, onDeletePart }: PartsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filter parts based on search and status
  const filteredParts = parts.filter((part) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      part.name.toLowerCase().includes(query) ||
      part.osNumber.toLowerCase().includes(query) ||
      part.osDescription.toLowerCase().includes(query) ||
      part.unit?.toLowerCase().includes(query);

    const matchesStatus = filterStatus === "all" || part.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-[#f5f0e8] h-screen overflow-hidden flex flex-col">
      {/* Sticky Header with Back Button and Title */}
      <div className="sticky top-0 bg-[#f5f0e8] z-20 pb-4 pt-6 px-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 
            style={{
              fontFamily: 'Lexend Deca, sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            GERENCIAMENTO DE PEÇAS
          </h1>
        </div>

        {/* Sticky Search Bar - Centered */}
        <div className="max-w-[600px] mx-auto">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
            <input
              type="text"
              placeholder="Pesquisar por peça, O.S ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:border-[#8b7355] transition-colors shadow-sm"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterStatus === "all"
                  ? "bg-[#8b7355] text-white border-[#8b7355]"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus("to-order")}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterStatus === "to-order"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              À Pedir
            </button>
            <button
              onClick={() => setFilterStatus("ordered")}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterStatus === "ordered"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              Pedidas
            </button>
            <button
              onClick={() => setFilterStatus("arriving")}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterStatus === "arriving"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              À Chegar
            </button>
            <button
              onClick={() => setFilterStatus("received")}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterStatus === "received"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              Recebidas
            </button>
          </div>

          {/* Add Part Button */}
          <div className="flex justify-center">
            <Button 
              onClick={onAddPart}
              className="bg-[#8b7355] hover:bg-[#7a6345] text-white rounded-full px-6 py-2 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Peça
            </Button>
          </div>
        </div>
      </div>

      {/* Parts List */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        {filteredParts.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhuma peça encontrada</p>
            <p className="text-sm mt-2">
              {searchQuery || filterStatus !== "all" 
                ? "Tente outra pesquisa ou filtro" 
                : "Adicione sua primeira peça"}
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-3">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className={`bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow ${
                  part.urgent ? "border-red-500 border-l-4" : "border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* Part Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {part.name}
                      </h3>
                      {part.urgent && (
                        <Badge className="bg-red-500 text-white flex items-center gap-1 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          URGENTE
                        </Badge>
                      )}
                      <span className={`px-3 py-1 text-xs rounded-full border ${statusConfig[part.status].color}`}>
                        {statusConfig[part.status].label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">O.S:</span>
                        <span className="ml-1 font-medium">{part.osNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Aparelho:</span>
                        <span className="ml-1">{part.osDescription}</span>
                      </div>
                      {part.unit && (
                        <div>
                          <span className="text-gray-600">Modelo:</span>
                          <span className="ml-1">{part.unit}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="ml-1 font-medium">{part.quantity}</span>
                      </div>
                      {part.price && (
                        <div>
                          <span className="text-gray-600">Preço:</span>
                          <span className="ml-1 font-medium text-green-700">{part.price}</span>
                        </div>
                      )}
                      {part.orderDate && (
                        <div>
                          <span className="text-gray-600">Pedido em:</span>
                          <span className="ml-1">{part.orderDate}</span>
                        </div>
                      )}
                      {part.expectedDate && (
                        <div>
                          <span className="text-gray-600">Previsão:</span>
                          <span className="ml-1">{part.expectedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onEditPart(part)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Editar peça"
                    >
                      <Pencil className="w-4 h-4 text-[#8b7355]" />
                    </button>
                    <button
                      onClick={() => onDeletePart(part.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Excluir peça"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}