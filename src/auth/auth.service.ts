import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/shared/repository/user.repository';
import { LoginData } from './dto/login.dto';
import { RegisterData } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService){}

    async login(data: LoginData){
        try{
            const user = await this.userRepository.findOne({email: data.email})
            if(!user){
               throw new NotFoundException("user with this email does not exist")
            }
            const passwordIsMatch = await bcrypt.compare(data.password, user.password);
            if(!passwordIsMatch){
                throw new UnauthorizedException("password not valid")
            }
            return this.signUser(user)
        }catch(e){
            return {message : e.message};
        }
    }

    async register(data: RegisterData){
        try {
            const user =  await this.userRepository.findOne({email: data.email})
            if(user){
                throw new UnauthorizedException("email already exist")
            }else{
                const saltOrRounds = parseInt(process.env.SALT);
                const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
                data.password = hashedPassword
                const newUser = await this.userRepository.create(data);
                return newUser;
            }
        }catch(e){
            return {message : e.message};
        }
    }

    signUser(user: any){
        return {accessToken: this.jwtService.sign({
            id: user._id,
            fullName: user.fullName
        })}

    }
}
