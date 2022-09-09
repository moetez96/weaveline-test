import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginData } from "./dto/login.dto";
import { RegisterData } from "./dto/register.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    login(@Body() data: LoginData){
        return this.authService.login(data);
    }

    @Post('register')
    register(@Body() data: RegisterData){
        return this.authService.register(data);
    }
}