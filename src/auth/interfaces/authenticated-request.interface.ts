import { AuthenticatedData } from './authenticated-data.interface';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedData;
}
