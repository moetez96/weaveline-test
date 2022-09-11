import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator'
export class LoginData {
    @ApiProperty({
        description: 'The email of the user',
        example: 'jhon.doe@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    readonly password: string;
}