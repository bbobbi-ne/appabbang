export const ClientType = {
  USER: 'user',
  CUSTOMER: 'customer',
} as const;
export type ClientType = (typeof ClientType)[keyof typeof ClientType];

export interface ClientPayload {
  id: string;
  name: string;
  type: ClientType;
  userRole?: 'admin' | 'subadmin';
}
