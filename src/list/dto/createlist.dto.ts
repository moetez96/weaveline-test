import { ApiProperty } from '@nestjs/swagger';
import {IsString, MinLength} from 'class-validator'
export class CreateListData {
    @ApiProperty({ 
        description: 'The name of the list',
        example: 'List 1'
    })
    @IsString()
    @MinLength(3)
    readonly name: string;
}