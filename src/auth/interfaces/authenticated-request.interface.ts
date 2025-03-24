import { User } from '../../users/user.entity';

/**
 * This is an authenticated request, meaning that JWT was previously validated and there's an object user inside of it.
 */
export interface AuthenticatedRequest extends Request {
  user: User;
}
