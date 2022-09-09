import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'
export class RegisterData {
    @IsString()
    @MinLength(3)
    readonly fullName: string;
    
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}