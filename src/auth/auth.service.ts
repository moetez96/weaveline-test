import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LoginData } from './dto/login.dto';
import { RegisterData } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService){}

    async login(data: LoginData){
        try{
            const user = await this.userModel.findOne({email: data.email})
            if(!user){
               throw new NotFoundException("user with this email does not exist")
            }
            if(user.password !== data.password){
                throw new UnauthorizedException("password not valid")
            }
            return this.signUser(user._id, user.fullName)
        }catch(e){
            return {message : e.message};
        }
    }

    async register(data: RegisterData){
        try {
            const user =  await this.userModel.findOne({email: data.email})
            if(user){
                throw new UnauthorizedException("email already exist")
            }else{
                const newUser = new this.userModel(data);
                const savedUser = newUser.save();
                return savedUser;
            }
        }catch(e){
            return {message : e.message};
        }
    }

    signUser(userId: Types.ObjectId, userFullName: string){
        return {accessToken: this.jwtService.sign({
            id: userId,
            fullName: userFullName
        })}

    }
}
