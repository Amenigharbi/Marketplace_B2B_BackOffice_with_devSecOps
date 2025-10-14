export interface Element {
  id: string;
  title: string;
}

export interface EditElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: Element | null;
}
