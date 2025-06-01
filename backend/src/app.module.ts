import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';

@Module({
  //imports: [MongooseModule.forRoot('mongodb://mongo:27017/nest'), AuthModule, UsersModule],
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
