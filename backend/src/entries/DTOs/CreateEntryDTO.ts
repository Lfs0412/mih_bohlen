import {IsBoolean, IsNumber, IsString} from "class-validator";

export class CreateEntryDTO {
    @IsNumber()
    projectId:number;
    @IsString()
    index:string;
    @IsString()
    entryName:string;
    @IsString()
    messages: string;
}