import { ArrowLeft } from "lucide-react";

interface EquipmentsPageProps {
  onBack: () => void;
}

export function EquipmentsPage({ onBack }: EquipmentsPageProps) {
  return (
    <div className="h-screen bg-[#f5f0e8] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Análise de equipamentos desativada</h2>
        <p className="text-sm text-gray-600 mt-2">O recurso de análise por equipamento foi removido.</p>
        <div className="mt-4">
          <button onClick={onBack} className="px-4 py-2 bg-[#8b7355] text-white rounded">Voltar</button>
        </div>
      </div>
    </div>
  );
}
       