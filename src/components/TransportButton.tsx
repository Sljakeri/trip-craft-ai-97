import { LucideIcon } from "lucide-react";

interface TransportButtonProps {
  icon: LucideIcon;
  label: string;
  type: string;
  selected: boolean;
  onToggle: (type: string) => void;
}

const TransportButton = ({ icon: Icon, label, type, selected, onToggle }: TransportButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      className={`transport-btn ${selected ? "selected" : ""}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
};

export default TransportButton;
