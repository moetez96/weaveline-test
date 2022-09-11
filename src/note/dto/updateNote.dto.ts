import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator'
export class UpdateNoteData {
    @ApiPropertyOptional({ 
        description: 'The description of the note',
        example: 'Description 1'
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiPropertyOptional({ 
        description: 'The description of the note',
        example: 'Description 1'
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly description: string;
}