import { invoiceStatusEnum } from '@/db/schema';

export interface IVendor {
  id: number;
  name: string;
  code: string;
  ceo?: string;
  address?: string;
  businessType?: string;
  item?: string;
  invoiceStatus: typeof invoiceStatusEnum.enumValues[number];
  modifier: string;
  modifiedAt: Date;
  createdAt: Date;
}

export interface IVendorCreate {
  name: string;
  code: string;
  ceo?: string;
  address?: string;
  businessType?: string;
  item?: string;
  invoiceStatus: typeof invoiceStatusEnum.enumValues[number];
  modifier: string;
}

export interface IVendorUpdate extends Omit<IVendorCreate, 'code'> {
  id: number;
}

export interface IVendorBulkStatusUpdate {
  vendorIds: number[];
  invoiceStatus: typeof invoiceStatusEnum.enumValues[number];
  modifier: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  searchField?: 'name' | 'code' | 'ceo';
  searchValue?: string;
  invoiceStatus?: typeof invoiceStatusEnum.enumValues[number] | 'all';
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

export interface IVendorContact {
  id?: number;
  vendorId: number;
  vendorName?: string;
  vendorCode?: string;
  branch?: string;
  email: string;
  status: '사용' | '미사용';
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
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

export interface IVendor {
  id: number;
  vendorCode: string;
  vendorName: string;
  representativeName: string;
  status: string;
}

export interface IPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ISearchParams {
  searchField: 'name' | 'code';
  searchValue: string;
  page: number;
  limit: number;
} 