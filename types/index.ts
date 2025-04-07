export interface IVendor {
  id: string;
  name: string;
  code: string;
  ceo: string;
  email: string;
  businessType: string;
  businessItem: string;
  invoiceStatus: '사용' | '미사용';
  modifier: string;
  modifiedAt: string;
}

export interface IBillingInvoice {
  id: string;
  vendor: IVendor;
  email: string;
  billing_month: string;
  payment_info: {
    amount: number;
    due_date: string;
    payment_method: string;
  };
  details: {
    order_number: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    contact: string;
  };
  attachments: Array<{
    name: string;
    url: string;
    type: 'html' | 'excel' | 'other';
  }>;
  status: 'not_sent' | 'success' | 'fail';
  sent_at: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface IBillingLog {
  id: string;
  invoice_id: string;
  sent_at: string;
  status: 'success' | 'fail';
  type: 'test' | 'real' | 'resend';
}

export interface ISearchParams {
  fromDate: string;
  toDate: string;
  searchField: 'name' | 'code' | 'ceo' | 'email';
  searchValue: string;
  status: 'all' | 'not_sent' | 'success' | 'fail';
  page: number;
  limit: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IVendorSearchParams {
  invoiceStatus: 'all' | 'used' | 'unused'
  searchField: 'name' | 'code' | 'ceo'
  searchValue: string
  page: number
  limit: number
}

export interface IVendorResponse {
  data: IVendor[]
  total: number
  page: number
  limit: number
}

export interface IVendorContact {
  id: number;
  vendorName: string;
  vendorCode: string;
  branch: string;
  email: string;
  status: '사용' | '미사용';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface IVendorContactsResponse {
  data: IVendorContact[];
  total: number;
  page: number;
  limit: number;
}

export interface IVendorContactSearchParams {
  status: 'all' | 'used' | 'unused';
  searchField: 'name' | 'code' | 'branch' | 'email';
  searchValue: string;
  page: number;
  limit: number;
}

export interface IVendorContactFormData {
  vendorId: number;
  branch: string;
  email: string;
  status: '사용' | '미사용';
}

export interface IVendorForm {
  id: number;
  vendorName: string;
  vendorCode: string;
  ceo: string;
  invoiceItems: {
    paymentInfo: boolean;
    membership: boolean;
    barcode: boolean;
    orderNumber: boolean;
    productGroup: boolean;
    modelName: boolean;
    contractDate: boolean;
    mandatoryPeriod: boolean;
    contractPeriod: boolean;
    supplyPrice: boolean;
    vat: boolean;
    rentalFee: boolean;
    installationAddress: boolean;
    defaultInterest: boolean;
    note: boolean;
    asCharge: boolean;
    consumableReplacementCost: boolean;
    penaltyFee: boolean;
    branchName: boolean;
    contact: boolean;
  };
  callCenterInfo: string;
  paymentDescription: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ISupplierInfo {
  businessNumber: string;
  companyName: string;
  ceo: string;
  address: string;
  businessType: string;
  item: string;
  sealImageUrl?: string;
}

export interface ISupplierFormError {
  businessNumber?: string;
  companyName?: string;
  ceo?: string;
  address?: string;
  businessType?: string;
  item?: string;
  sealImage?: string;
}

export interface IInvoiceFile {
  id: number;
  vendorName: string;
  vendorCode: string;
  ceo: string;
  billingMonth: string;
  hasHtml: boolean;
  hasExcel: boolean;
  hasEtc: boolean;
}

export interface IInvoiceFileSearchParams {
  searchField: 'name' | 'code' | 'ceo' | 'branch';
  searchValue: string;
  dateType: 'sent' | 'billing';
  fromDate?: string;
  toDate?: string;
  billingMonth?: string;
  page: number;
  limit: number;
}

export interface IInvoiceFileResponse {
  data: IInvoiceFile[];
  total: number;
  page: number;
  limit: number;
} 