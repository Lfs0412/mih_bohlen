import {IsString} from "class-validator";

export class CreateProjectDTO {
    @IsString()
    projectName:string;
    @IsString()
    projectDescription:string;

}