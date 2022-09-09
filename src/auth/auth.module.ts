import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
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
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
