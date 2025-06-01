import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUser = { userId: 1, username: 'testuser', password: 'testpass', email: 'test@example.com' };
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser', 'testpass');

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toEqual({ userId: 1, username: 'testuser', email: 'test@example.com' });
      expect(result.password).toBeUndefined();
    });

    it('should return null when password is incorrect', async () => {
      const mockUser = { userId: 1, username: 'testuser', password: 'testpass' };
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser', 'wrongpass');

      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'anypass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token for valid user', async () => {
      const mockUser = { userId: 1, username: 'testuser' };
      const mockToken = 'mock.jwt.token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'testuser', sub: 1 });
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});