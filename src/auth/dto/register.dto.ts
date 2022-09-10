import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator'
export class RegisterData {
    @IsString()
    @MinLength(3)
    readonly fullName: string;
    
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    public password: string;

}