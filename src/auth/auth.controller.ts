import { BadRequestException, Body, Controller, NotFoundException, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginData } from "./dto/login.dto";
import { RegisterData } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/shared/services/user.service";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AccessToken } from "src/swagger/jwtToken.swagger";
import { User } from "src/model/user.schema";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService, 
        private authService: AuthService
        ){}
    
    @ApiCreatedResponse({
        description: 'Login successful',
        type: AccessToken
    })
    @ApiNotFoundResponse({
        description: 'Email does not exist',
    })
    @ApiUnauthorizedResponse({
        description: "Wrong password"
    })
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

    @ApiCreatedResponse({
        description: 'Register successful',
        type: User
    })
    @ApiBadRequestResponse({
        description: 'Credentials not valid',
    })
    @ApiUnauthorizedResponse({
        description: 'Email already exist',
    })
    @Post('register')
    async register(@Body() data: RegisterData){
        const user =  await this.userService.findOne({email: data.email});
        if(user){
            throw new UnauthorizedException("email already exist");
        }
        const saltOrRounds = parseInt(process.env.SALT);
        const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
        data.password = hashedPassword;
        const newUser = await this.userService.create(data);
        return newUser;
    }
}

