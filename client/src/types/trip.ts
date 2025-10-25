// NEW: Interface for a single packing list item
export interface PackingListItem {
  _id: string;
  item: string;
  packed: boolean;
}

// This is your main Trip interface
export interface Trip {
  _id: string;
  name: string; // This should match your model (name or title)
  description?: string;
  destination: {
    city: string;
    country: string;
  };
  startDate: string;
  endDate: string;
  budget: {
    total: number;
    currency: string;
    spent: number;
  };
  status: string;
  travelers: {
    name: string;
    email: string;
    role: string;
  }[];
  notes?: string;
  tags: string[];
  // NEW: Added packingList
  packingList: PackingListItem[];
}
