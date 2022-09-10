import {IsString, MinLength} from 'class-validator'
export class CreateListData {
    @IsString()
    @MinLength(3)
    readonly name: string;
}