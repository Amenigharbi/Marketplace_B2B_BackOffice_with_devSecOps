export type Item = {
  name: string;
  key: string;
  action?: (orderId?: string) => void;
};

export type Props = {
  items: Array<Item>;
  onSelect?: (item: any) => void;
  selected: Item | undefined;
  placeholder?: string;
};

export type DropRef = {
  reset: () => void;
};
