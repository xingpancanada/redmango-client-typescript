export enum SD_Roles {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export enum SD_Status {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  BEING_COOKED = "Being Cooked",
  READY_FOR_PICKUP = "Ready for Pickup",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum SD_Categories {
  // APPETIZER = 'Appetizer',
  // ENTREE = 'Entree',
  // DESSERT = 'Dessert',
  // BEVERAGES = 'Beverages',
  FIGHTINGFISH = 'Fighting Fish',
  GOLDFISH = 'Gold Fish',
  KOIFISH = 'Koi Fish',
  ANGELFISH = 'Angel Fish',
}

export enum SD_SortTypes {
  PRICE_LOW_HIGH = "Price Low to High",
  PRICE_HIGH_LOW = "Price High to Low",
  NAME_A_Z = "Name A - Z",
  NAME_Z_A = "Name Z - A",
}