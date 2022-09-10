import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { RegisterData } from "src/auth/dto/register.dto";
import { User, UserDocument } from "src/model/user.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
    
     async findById(userId: string): Promise<any> {
        return this.userModel.findById(userId);
    }
    
    async findOne(userFilterQuery: FilterQuery<User>): Promise<UserDocument> {
        return this.userModel.findOne(userFilterQuery);
    }
    
    async find(userFilterQuery: FilterQuery<User>): Promise<UserDocument[]> {
        return this.userModel.find(userFilterQuery);
    }

    async create(user: RegisterData): Promise<UserDocument> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }
    async findOneAndUpdate(userFilterQuery: FilterQuery<User>, user: Partial<User>): Promise<UserDocument> {
        
        return this.userModel.findOneAndUpdate(userFilterQuery, user)
    }
}