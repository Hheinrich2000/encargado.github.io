import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

export function FloatingActionButton({ onClick, ariaLabel = 'Añadir' }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fab"
      aria-label={ariaLabel}
    >
      <Plus className="w-7 h-7" />
    </button>
  );
}
