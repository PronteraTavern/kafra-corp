import { User } from '../../users/user.entity';
import { Request } from 'express';

/**
 * This is an authenticated request, meaning that JWT was previously validated and there's an object user inside of it.
 */
export interface AuthenticatedRequest extends Request {
  user: User;
}
