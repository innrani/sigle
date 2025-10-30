// Removed unused import

interface HistoryPageProps {
  onBack: () => void;
}

export function HistoryPage({ onBack }: HistoryPageProps) {
  return (
    <div className="h-screen bg-[#f5f0e8] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Histórico desativado</h2>
        <p className="text-sm text-gray-600 mt-2">O recurso de histórico de ordens foi removido.</p>
        <div className="mt-4">
          <button onClick={onBack} className="px-4 py-2 bg-[#8b7355] text-white rounded">Voltar</button>
        </div>
      </div>
    </div>
  );
}
