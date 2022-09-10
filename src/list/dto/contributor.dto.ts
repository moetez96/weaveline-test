import {IsEnum} from 'class-validator'
export enum AppState {
  READONLY = 'readonly',
  READWRITE = 'readwrite',
}
export class ContributorData {
    @IsEnum(AppState)
    readonly privilege: string;
}

