import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator'
export class CreateNoteData {
    @ApiProperty({ 
        description: 'The name of the note',
        example: 'Note 1'
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ 
        description: 'The description of the note',
        example: 'Description 1'
    })
    @IsString()
    @IsNotEmpty()
    readonly description: string;
}