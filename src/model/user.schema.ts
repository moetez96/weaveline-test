import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
export type UserDocument = User & Document;
@Schema()
export class User {
    
    @ApiProperty({ 
        description: 'The full name of the user', 
        example: "Jon doe" 
    })
    @Prop({required:true})
    fullName: string;

    @ApiProperty({ 
        description: 'The email of the user', 
        example: "jon.doe@gmail.com"
    })
    @Prop({required:true, unique:true, lowercase:true})
    email: string;

    @ApiProperty({ 
        description: 'The password of the user', 
        example: "$2b$10$xt07uUC/S26TKxkyUR/uSeiuKdKfi5x1MJGYwOlH4HRE35hHu7Qd." 
    })
    @Prop({required:true})
    password: string

}
export const UserSchema = SchemaFactory.createForClass(User);