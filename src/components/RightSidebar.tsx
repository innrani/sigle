import { Wrench, User, Settings, Laptop } from "lucide-react";
import { Badge } from "./ui/badge";

interface RightSidebarProps {
  onOpenAddModal: () => void;
  onNavigateToClients: () => void;
  onNavigateToParts: () => void;
  onNavigateToEquipments: () => void;
  onManageTechnicians: () => void;
}

export function RightSidebar({
  onOpenAddModal,
  onNavigateToClients,
  onNavigateToParts,
  onNavigateToEquipments,
  onManageTechnicians,
}: RightSidebarProps) {
  return (
    <div className="bg-[#8b7355] text-white h-full px-3 py-4 flex flex-col top-0 right-0 absolute rounded-l-[30px]">
      <div className="text-center mb-3">
        <div
          style={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Lexend Deca, sans-serif",
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 200,
            lineHeight: "32px",
            letterSpacing: "5.76px",
          }}
        >
          SIGLE
        </div>
        <div
          style={{
            color: "#FFF",
            fontFamily: "Lexend Deca, sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 200,
            lineHeight: "32px",
            letterSpacing: "2.88px",
          }}
        >
          SYSTEM
        </div>
      </div>

      <button
        onClick={onOpenAddModal}
        className="bg-[#d4c5a0] text-black rounded-full py-2 px-4 mb-4 flex items-center justify-center gap-2 hover:bg-[#c4b590] transition-colors"
      >
        <span className="text-2xl">+</span>
        <span
          style={{
            fontFamily: "Lexend Deca, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.6px",
          }}
        >
          NOVO CLIENTE
        </span>
      </button>

      <nav className="flex flex-col gap-1.5 flex-1">
        <button
          onClick={onNavigateToParts}
          className="flex items-center justify-center gap-2 py-1.5 px-2 hover:bg-[#7a6345] rounded-lg transition-colors relative"
        >
          <Wrench className="w-4 h-4 flex-shrink-0" />
          <span
            style={{
              fontFamily: "Lexend Deca, sans-serif",
              fontSize: "9px",
              fontWeight: 300,
              letterSpacing: "0.4px",
              textAlign: "center",
            }}
          >
            PEÇAS
          </span>
          {2 > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
            >
              2
            </Badge>
          )}
        </button>

        <button
          onClick={onNavigateToEquipments}
          className="flex items-center justify-center gap-2 py-1.5 px-2 hover:bg-[#7a6345] rounded-lg transition-colors relative"
        >
          <Laptop className="w-4 h-4 flex-shrink-0" />
          <span
            style={{
              fontFamily: "Lexend Deca, sans-serif",
              fontSize: "9px",
              fontWeight: 300,
              letterSpacing: "0.4px",
              textAlign: "center",
            }}
          >
            EQUIPAMENTOS
          </span>
        </button>

        <button
          onClick={onNavigateToClients}
          className="flex items-center justify-center gap-2 py-1.5 px-2 hover:bg-[#7a6345] rounded-lg transition-colors relative"
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span
            style={{
              fontFamily: "Lexend Deca, sans-serif",
              fontSize: "9px",
              fontWeight: 300,
              letterSpacing: "0.4px",
              textAlign: "center",
            }}
          >
            CLIENTE
          </span>
        </button>
      </nav>

      <div className="mt-auto pt-3 border-t border-[#7a6345]">
        <button
          onClick={onManageTechnicians}
          className="w-full flex items-center justify-center gap-2 py-2 px-2 hover:bg-[#7a6345] rounded-lg transition-colors"
          title="Gerenciar Técnicos"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span
            style={{
              fontFamily: "Lexend Deca, sans-serif",
              fontSize: "9px",
              fontWeight: 300,
              letterSpacing: "0.4px",
              textAlign: "center",
            }}
          >
            TÉCNICOS
          </span>
        </button>
      </div>
    </div>
  );
}