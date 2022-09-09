import {IsString, MinLength} from 'class-validator'
export class ListData {
    @IsString()
    @MinLength(3)
    readonly name: string;
}