import {IsNotEmpty, IsString, MinLength} from 'class-validator'
export class CreateNoteData {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}