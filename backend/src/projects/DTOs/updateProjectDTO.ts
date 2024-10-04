import {IsNumber, IsString} from "class-validator";

export class UpdateProjectDTO {
    @IsNumber()
    projectID?:number;
    @IsString()
    projectName?:string;
    @IsString()
    projectDescription?:string;
}