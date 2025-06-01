import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call authService.login with user data', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockReq = { user: mockUser };
      const expectedResult = { access_token: 'token' };
      
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await appController.login(mockReq);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    it('should call req.logout', async () => {
      const mockLogout = jest.fn();
      const mockReq = { logout: mockLogout };

      await appController.logout(mockReq);

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user from request', () => {
      const mockUser = { id: 1, username: 'test' };
      const mockReq = { user: mockUser };

      const result = appController.getProfile(mockReq);

      expect(result).toEqual(mockUser);
    });
  });
});
