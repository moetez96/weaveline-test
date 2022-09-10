import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
export type ContributorDocument = Contributor & Document;
@Schema({_id : false})
export class Contributor {

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    })   
    user: User;

    @Prop({
        required:true,
        enum: ['readonly', 'readwrite']
    })
    privilege: string;

}
export const ContributorSchema = SchemaFactory.createForClass(Contributor);