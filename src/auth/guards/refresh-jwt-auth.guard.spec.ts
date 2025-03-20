import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';

describe('RefreshJwtAuthGuard', () => {
  let guard: RefreshJwtAuthGuard;
  let reflector: Reflector;
  let executionContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RefreshJwtAuthGuard(reflector);
    executionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access if route is public', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = guard.canActivate(executionContext);

    expect(result).toBe(true);
  });

  it('should call super.canActivate if route is protected', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const superCanActivateSpy = jest
      .spyOn(AuthGuard('refresh-jwt').prototype, 'canActivate')
      .mockReturnValue(false);

    const result = guard.canActivate(executionContext);

    expect(result).toBe(false);
    expect(superCanActivateSpy).toHaveBeenCalledWith(executionContext);
  });
});
