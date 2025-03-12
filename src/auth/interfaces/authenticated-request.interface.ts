import { JwtPayload } from './jwt-payload.interface';

/**
 * This is an authenticated request, meaning that JWT was previously validated and there's an object user inside of it.
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
