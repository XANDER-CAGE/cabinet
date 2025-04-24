
export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}

export interface DriverEntity {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cardNumber: string;
  address: string;
  cityName: string;
  stateId: string;
  stateName: string;
  confirmed: boolean;
  organizationId: number;
  organizationName: string;
  companyId: number;
  companyName: string;
  efsAccountId: number;
  efsAccountName: string;
  driverUnit: string;
  roleCode: string;
  registerTime: Date;
  permissionList: string[];
  includeStations: number[];
}

export interface CompanyEntity {
  id: number;
  name: string;
  number: string;
  email: string;
  phone: string;
  cityId: number;
  stateId: string;
  address: string;
  isDeleted: boolean;
}

export interface CustomerEntity {
  id: number;
  name: string;
  email: string;
  phone: string;
  cityId: number;
  stateId: string;
  address: string;
  isDeleted: boolean;
  logoUrl: string;
  iconUrl: string;
  markerColor: string;

  checked: boolean;
}

export interface StationEntity {
  id: number;
  name: string;
  lat: number;
  lng: number;
  cityId: number;
  cityName: string;
  customerId: number;
  customerName: string;
  address: string;
  phone: string;
  stateId: string;
  stateName: string;
  discountPrice: number;
  bestPrice: number;
  retailPrice: number;
  number: string;
  priceUpdated: Date;
  isOpen: boolean;
  isEmpty: boolean;
  identifier: string;
}

export interface DiscountEntity {
  id: number;
  stationId: number;
  discount: number;
  best: number;
  retail: number;
  apply: number;
  time: Date;
}

export interface DiscountedFileEntity {
  id: number;
  ownerId: string;
  uploadTime: Date;
  fileName: string;
  filePath: string;
  isImported: boolean;
  executionResult: string;
  customerId: number;
}

export interface FeedbackEntity {
  id: number;
  userId: string;
  driverName: string;
  postTime: Date;
  favoriteStar: number;
  comment: string;
  isConfirmed: boolean;
  confirmDate: Date;
  stationId: number;
  isMain: boolean;
  isDeleted: boolean;
  stationName: string;
  stationLocation: string;
}

export interface LocationAddress {
  lat: number;
  lng: number;
}

export interface MapsLocation {
  address: MapsAddress;
  coords: MapsCoords;
  region: number;
  POITypeID: number;
  PersistentPOIID: number;
  siteID: number;
  resultType: number;
  shortString: string;
  timeZone: string;
}

export interface MapsCoords {
  lat: number;
  lon: number;
}

export interface MapsAddress {
  atreetAddress: string;
  localArea: string;
  city: string;
  state: string;
  stateName: string;
  zip: string;
  county: string;
  country: string;
  countryFullName: string;
  SPLC: any;
}

export interface TransactionEntity {
  id: number;
  cardNumber: string;
  transactionDate: string;
  invoiceNumber: string;
  unit: string;
  driverName: string;
  odometer: number;
  locationName: string;
  city: string;
  state: string;
  fees: number;
  item: string;
  unitPrice: number;
  discPpu: number;
  discCost: number;
  quantity: number;
  discAmount: number;
  discType: string;
  amount: number;
  db: string;
  currency: string;
  hash: string;
  fileName: string;
}

export interface InvoiceEntity {
  id: number;
  companyAccountId: number;
  invoiceNumber: string;
  isSentToEmail: boolean;
  startPeriod: string;
  endPeriod: string;
  totalDiscount: number;
  totalFees: number;
  totalAmount: number;
  totalPaid: number;
  remainingAmount: number;
  additionalCharge: number;
  bonus: number;
  invoiceDate: string;
  dueDate: string;
  lastPaymentDate: string;
  lastPaymentNote: string;
  status: string;
  notes: string;
  companyAccount: any;
  totalDiscountedGallons: number;
  averageDiscountPerGallon: number;
  discountEditedInfo: string;
}

export interface ServerConfig {
  version: string;
  ios: string;
  android: string;
  lastUpdatedStation: number;
  mapKey: string;
}
