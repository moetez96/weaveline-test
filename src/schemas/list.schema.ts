import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Participant } from "./participant.schema";
import { User } from "./user.schema";
export type ListDocument = List & Document;
@Schema()
export class List {
    @Prop({required:true})
    name: string;
    
    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'owner' 
    })   
    owner: User;
    
    @Prop()
    participants : [Participant]

}
export const ListSchema = SchemaFactory.createForClass(List);