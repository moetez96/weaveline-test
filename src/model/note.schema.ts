import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";
import { List } from "./list.schema";
import { User } from "./user.schema";
export type NoteDocument = Note & Document;
@Schema()
export class Note {
    @ApiProperty({ 
        description: 'The name of the note', 
        example: "Note 1" 
    })
    @Prop({required:true})
    name: string;
    
    @ApiProperty({ 
        description: 'The description of the note', 
        example: "Description 1" 
    })
    @Prop({required:true})
    description: string;

    @ApiProperty({ 
        description: 'The notes list', 
        example: "ObjectId(631ce40441d93187de871548)", 
    })
    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'list' 
    })
    list: List

    @ApiProperty({ 
        description: 'The creator of the note', 
        example: "ObjectId(631ce40441d93187de871548)", 
    })
    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    })
    creator: User

}
export const NoteSchema = SchemaFactory.createForClass(Note);