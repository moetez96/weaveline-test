import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator'
export class RegisterData {
    @ApiProperty({
        description: 'The users full name',
        example: 'Jon Doe'
    })
    @IsString()
    @MinLength(3)
    readonly fullName: string;
    
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
    public password: string;

}