import { UserPayload } from '../client-payload';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
