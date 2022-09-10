import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { List } from "./list.schema";
import { User } from "./user.schema";
export type NoteDocument = Note & Document;
@Schema()
export class Note {
    @Prop({required:true})
    name: string;
    
    @Prop({required:true})
    description: string;

    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'list' 
    })
    list: List

    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    })
    creator: User

}
export const NoteSchema = SchemaFactory.createForClass(Note);