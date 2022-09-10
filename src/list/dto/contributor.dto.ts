import {IsEnum} from 'class-validator'
import { Privilege } from '../enums/privilege.enum';

export class ContributorData {
    @IsEnum(Privilege)
    readonly privilege: string;
}

