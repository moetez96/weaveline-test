import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/user.schema';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { UserService } from 'src/shared/services/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), 
  JwtModule.registerAsync({
     useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '1d'}
      })
  })],  
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRepository, UserService]
})
export class AuthModule {}
