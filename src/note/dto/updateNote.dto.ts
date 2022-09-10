import {IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf} from 'class-validator'
export class UpdateNoteData {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => !o.description || o.name)
    readonly name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => !o.name || o.description)
    readonly description: string;
}