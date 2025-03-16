import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy'; // Adjust the path accordingly
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';


@
describe.skip('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should throw an error if JWT_SECRET is not set', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

    expect(() => {
      new JwtStrategy(configService);
    }).toThrow(Error);
  });

  it('should validate the JWT payload correctly', () => {
    const payload: JwtPayload = { id: 'abc', role: 'admin' };

    jest.spyOn(configService, 'get').mockReturnValueOnce('mocked-jwt-secret');

    expect(strategy.validate(payload)).toEqual(payload);
  });
});
