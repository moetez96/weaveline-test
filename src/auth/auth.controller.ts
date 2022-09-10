import { BadRequestException, Body, Controller, InternalServerErrorException, NotFoundException, Post, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { LoginData } from "./dto/login.dto";
import { RegisterData } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/shared/services/user.service";

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService, 
        private jwtService: JwtService,
        private authService: AuthService
        ){}
    
    @Post('login')
    async login(@Body() data: LoginData){
        const user = await this.userService.findOne({email: data.email});
        if(!user){
            throw new NotFoundException("user with this email does not exist");
        }
        const passwordIsMatch = await bcrypt.compare(data.password, user.password);
        if(!passwordIsMatch){
            throw new UnauthorizedException("password not valid");
        }
        return this.authService.signUser(user);
    }

    @Post('register')
    async register(@Body() data: RegisterData){
        const user =  await this.userService.findOne({email: data.email});
        if(user){
            throw new BadRequestException("email already exist");
        }
        const saltOrRounds = parseInt(process.env.SALT);
        const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
        data.password = hashedPassword;
        const newUser = await this.userService.create(data);
        return newUser;
    }
}

