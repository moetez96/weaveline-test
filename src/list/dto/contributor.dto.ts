import { ApiProperty } from '@nestjs/swagger';
import {IsEnum} from 'class-validator'
import { Privilege } from '../enums/privilege.enum';

export class ContributorData {
    @ApiProperty({ 
        description: 'The privilege option',
        example: 'readonly',
        enum: Privilege,
    })
    @IsEnum(Privilege)
    readonly privilege: string;
}

