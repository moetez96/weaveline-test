import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Contributor } from "./contributor.schema";
import { User } from "./user.schema";
export type ListDocument = List & Document;
@Schema()
export class List {
    @Prop({required:true, unique: true})
    name: string;
    
    @Prop({ 
        required:true, 
        type: mongoose.Schema.Types.ObjectId, ref: 'owner' 
    })   
    owner: User;
    
    @Prop()
    contributors : [Contributor]

}
export const ListSchema = SchemaFactory.createForClass(List);