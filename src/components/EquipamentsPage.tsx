import { ArrowLeft, Search, TrendingUp, AlertCircle, Wrench, Calendar, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Badge } from "./ui/badge";
import type { ServiceOrder } from "../types";

interface EquipmentsPageProps {
  onBack: () => void;
  serviceOrders: ServiceOrder[];
  onViewServiceOrder: (serviceOrder: ServiceOrder) => void;
}

// Agrupa ordens de serviço por equipamento (brand + model)
interface EquipmentStats {
  brand: string;
  model: string;
  device: string;
  totalServices: number;
  serviceOrders: ServiceOrder[];
  defects: { defect: string; count: number; percentage: number }[];
  lastServiceDate: string;
  serialNumbers: string[];
}

function groupServiceOrdersByEquipment(serviceOrders: ServiceOrder[]): EquipmentStats[] {
  const equipmentMap = new Map<string, EquipmentStats>();

  serviceOrders.forEach((os) => {
    // Chave única: brand + model (case insensitive)
    const key = `${os.brand.toLowerCase()}_${os.model.toLowerCase()}`;

    if (!equipmentMap.has(key)) {
      equipmentMap.set(key, {
        brand: os.brand,
        model: os.model,
        device: os.device,
        totalServices: 0,
        serviceOrders: [],
        defects: [],
        lastServiceDate: os.entryDate || os.createdAt,
        serialNumbers: [],
      });
    }

    const equipment = equipmentMap.get(key)!;
    equipment.totalServices++;
    equipment.serviceOrders.push(os);

    // Atualizar última data de serviço
    const currentDate = os.entryDate || os.createdAt;
    if (currentDate > equipment.lastServiceDate) {
      equipment.lastServiceDate = currentDate;
    }

    // Coletar números de série únicos
    if (os.serialNumber && !equipment.serialNumbers.includes(os.serialNumber)) {
      equipment.serialNumbers.push(os.serialNumber);
    }
  });

  // Calcular estatísticas de defeitos
  equipmentMap.forEach((equipment) => {
    const defectMap = new Map<string, number>();

    equipment.serviceOrders.forEach((os) => {
      const defect = os.defect.trim();
      defectMap.set(defect, (defectMap.get(defect) || 0) + 1);
    });

    equipment.defects = Array.from(defectMap.entries())
      .map(([defect, count]) => ({
        defect,
        count,
        percentage: Math.round((count / equipment.totalServices) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  });

  return Array.from(equipmentMap.values()).sort((a, b) => b.totalServices - a.totalServices);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function EquipmentsPage({ onBack, serviceOrders, onViewServiceOrder }: EquipmentsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentStats | null>(null);

  // Agrupar equipamentos
  const equipments = groupServiceOrdersByEquipment(serviceOrders);

  // Filtrar por busca
  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.device.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                setSelectedEquipment(null);
                onBack();
              }}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-[#181717] font-['Lexend_Deca']">Equipamentos - Análise Estatística</h1>
              <p className="text-sm text-gray-600">
                {equipments.length} modelo{equipments.length !== 1 ? "s" : ""} diferente
                {equipments.length !== 1 ? "s" : ""} • {serviceOrders.length} O.S registrada
                {serviceOrders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por marca, modelo ou tipo de aparelho..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#f5f0e8]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedEquipment ? (
          // Detalhe do Equipamento
          <div className="p-6">
            <Button
              onClick={() => setSelectedEquipment(null)}
              variant="ghost"
              size="sm"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para lista
            </Button>

            {/* Cabeçalho do Equipamento */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-['Lexend_Deca'] text-[#181717] mb-2">
                    {selectedEquipment.brand} {selectedEquipment.model}
                  </h2>
                  <p className="text-gray-600">{selectedEquipment.device}</p>
                  {selectedEquipment.serialNumbers.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Números de Série: {selectedEquipment.serialNumbers.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8b7355]">
                      {selectedEquipment.totalServices}
                    </div>
                    <div className="text-gray-600">Serviços</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8b7355]">
                      {selectedEquipment.defects.length}
                    </div>
                    <div className="text-gray-600">Defeitos Únicos</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Último serviço: {formatDate(selectedEquipment.lastServiceDate)}
              </div>
            </div>

            {/* Estatísticas de Defeitos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[#8b7355]" />
                <h3 className="font-['Lexend_Deca'] text-lg text-[#181717]">
                  Problemas Recorrentes
                </h3>
              </div>

              <div className="space-y-3">
                {selectedEquipment.defects.map((defect, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{defect.defect}</span>
                        <span className="text-sm font-bold text-[#8b7355]">{defect.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#8b7355] h-2 rounded-full transition-all"
                          style={{ width: `${defect.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {defect.count} ocorrência{defect.count !== 1 ? "s" : ""} de{" "}
                        {selectedEquipment.totalServices}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alerta de problema crítico */}
              {selectedEquipment.defects.length > 0 &&
                selectedEquipment.defects[0].percentage >= 50 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-amber-900">Problema Crítico Identificado</div>
                      <div className="text-xs text-amber-700 mt-1">
                        Este modelo apresenta "{selectedEquipment.defects[0].defect}" em{" "}
                        {selectedEquipment.defects[0].percentage}% dos casos. Considere manter peças de
                        reposição em estoque.
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Lista de Ordens de Serviço */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-[#8b7355]" />
                <h3 className="font-['Lexend_Deca'] text-lg text-[#181717]">
                  Histórico de Serviços ({selectedEquipment.totalServices})
                </h3>
              </div>

              <div className="space-y-2">
                {selectedEquipment.serviceOrders
                  .sort((a, b) => {
                    const dateA = new Date(b.entryDate || b.createdAt);
                    const dateB = new Date(a.entryDate || a.createdAt);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((os) => (
                    <button
                      key={os.id}
                      onClick={() => onViewServiceOrder(os)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">O.S #{os.osNumber}</span>
                          <Badge
                            variant={
                              os.status === "completed"
                                ? "default"
                                : os.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {os.status === "completed"
                              ? "Concluído"
                              : os.status === "in-progress"
                              ? "Em andamento"
                              : os.status === "waiting-parts"
                              ? "Aguardando peças"
                              : os.status === "cancelled"
                              ? "Cancelado"
                              : "Pendente"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Cliente:</span> {os.clientName}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Defeito:</span> {os.defect}
                        </div>
                        {os.serialNumber && (
                          <div className="text-xs text-gray-500 mt-1">S/N: {os.serialNumber}</div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {formatDate(os.entryDate || os.createdAt)}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          // Lista de Equipamentos
          <div className="p-6">
            {filteredEquipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-500 mb-2">
                  {searchQuery ? "Nenhum equipamento encontrado" : "Nenhum equipamento registrado"}
                </h3>
                <p className="text-sm text-gray-400">
                  {searchQuery
                    ? "Tente ajustar sua busca"
                    : "Equipamentos são registrados automaticamente ao criar Ordens de Serviço"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEquipments.map((equipment, index) => {
                  const topDefect = equipment.defects[0];
                  const hasRecurrentIssue = topDefect && topDefect.percentage >= 50;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedEquipment(equipment)}
                      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-[#8b7355] transition-all text-left"
                    >
                      {/* Cabeçalho do Card */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-['Lexend_Deca'] font-medium text-gray-900 mb-1">
                            {equipment.brand}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">{equipment.model}</p>
                          <p className="text-xs text-gray-500 mt-1">{equipment.device}</p>
                        </div>
                        {hasRecurrentIssue && (
                          <div className="bg-amber-100 p-1.5 rounded-full" title="Problema recorrente">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                          </div>
                        )}
                      </div>

                      {/* Estatísticas */}
                      <div className="flex items-center gap-4 mb-3 py-2 border-t border-b border-gray-100">
                        <div className="text-center">
                          <div className="text-xl font-bold text-[#8b7355]">
                            {equipment.totalServices}
                          </div>
                          <div className="text-xs text-gray-600">
                            {equipment.totalServices === 1 ? "serviço" : "serviços"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-[#8b7355]">
                            {equipment.defects.length}
                          </div>
                          <div className="text-xs text-gray-600">
                            {equipment.defects.length === 1 ? "defeito" : "defeitos"}
                          </div>
                        </div>
                      </div>

                      {/* Problema mais comum */}
                      {topDefect && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">Problema mais comum:</div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate flex-1">
                              {topDefect.defect}
                            </p>
                            <Badge
                              variant={topDefect.percentage >= 50 ? "destructive" : "secondary"}
                              className="ml-2"
                            >
                              {topDefect.percentage}%
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Última data de serviço */}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                        <Calendar className="w-3 h-3" />
                        Último: {formatDate(equipment.lastServiceDate)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {!selectedEquipment && filteredEquipments.length > 0 && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredEquipments.length} de {equipments.length} modelo
              {equipments.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-4">
              <span>Total de O.S: {serviceOrders.length}</span>
              <span>
                Média de serviços por modelo:{" "}
                {equipments.length > 0
                  ? (serviceOrders.length / equipments.length).toFixed(1)
                  : "0"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
