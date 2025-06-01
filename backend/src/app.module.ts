import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  //imports: [MongooseModule.forRoot('mongodb://mongo:27017/nest'), AuthModule, UsersModule],
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}

