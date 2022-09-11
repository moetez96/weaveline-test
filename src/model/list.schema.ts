import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";
import { Contributor } from "./contributor.schema";
import { User } from "./user.schema";
export type ListDocument = List & Document;
@Schema()
export class List {

    @ApiProperty({ 
        description: 'The name of the list', 
        example: "List 1" 
    })
    @Prop({required:true})
    name: string;
    
    @ApiProperty({ 
        description: 'The owner of the list', 
        example: "ObjectId(631ce40441d93187de871548)", 
    })
    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    })   
    owner: User;
    
    @ApiProperty({ 
        description: 'The list of contributors', 
        example: [],
        type: Contributor
    })
    @Prop()
    contributors : [Contributor]
    

}
export const ListSchema = SchemaFactory.createForClass(List);