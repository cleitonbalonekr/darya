import { Document, Types } from 'mongoose';

export interface ProductInterface extends Document {
  name: string;
  price: number;
  description?: string;
  cust: number;
  stock?: number;
}

export interface DeliverymanInterface extends Document {
  name: string;
  working_day: boolean;
  avaliable?: boolean;
  phone: string;
}
export interface DistrictInterface extends Document {
  name: string;
  city: string;
  rate: number;
}
export interface AddressInterface extends Document {
  district: DistrictInterface;
  street: string;
  reference: string;
  number: number;
}
export interface ClientInterface extends Document {
  name: string;
  address: AddressInterface[];
  phone: string[];
}
export interface ItemsInterface extends Document {
  product: ProductInterface;
  quantity: Number;
}

export interface OrderInterface extends Document {
  identification: string;
  client: ClientOrderInterface;
  address: AddressOrderInterface;
  deliveryman: DeliverymanInterface;
  items: ItemsInterface[];
  total?: number;
  finished?: boolean;
  source: string;
  note?: string;
  payment?: string;
}
export interface ClientOrderInterface {
  client_id: Types.ObjectId;
  name: string;
  phone: string[];
}
export interface AddressOrderInterface {
  street: string;
  reference: string;
  number: number;
  district_rate: number;
  district_name: string;
  district_id: Types.ObjectId;
  client_address_id: Types.ObjectId;
}