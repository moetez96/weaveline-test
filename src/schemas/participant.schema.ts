import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
export type ParticipantDocument = Participant & Document;
@Schema()
export class Participant {

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
export const ParticipantSchema = SchemaFactory.createForClass(Participant);