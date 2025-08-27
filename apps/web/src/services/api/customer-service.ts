import { Customers } from '@/api/Customers';
import { CustomHttpClient } from '../httpclient-instance';
import { refreshCreate } from './auth-service';
import type { CustomersCreatePayload, SendEmailCreatePayload } from '@/api/data-contracts';

const customerApi = new Customers(new CustomHttpClient({}, refreshCreate));

export const CustomerService = {
  create: async (data: CustomersCreatePayload) => {
    const response = await customerApi.customersCreate(data);
    return response.data;
  },
  sendEmail: async (email: SendEmailCreatePayload) => {
    const response = await customerApi.sendEmailCreate(email);
    return response.data;
  },
};
