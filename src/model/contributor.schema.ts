import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Types } from "mongoose";
import { User } from "./user.schema";
export type ContributorDocument = Contributor & Document;
@Schema({_id : false})
export class Contributor {

    @ApiProperty({ 
        description: 'The contributor', 
        example: "ObjectId(631ce40441d93187de871548)",
    })
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    })   
    user: User;

    @ApiProperty({ 
        description: 'The contributor', 
        example: "readonly"
    })
    @Prop({
        required:true,
        enum: ['readonly', 'readwrite']
    })
    privilege: string;

}
export const ContributorSchema = SchemaFactory.createForClass(Contributor);