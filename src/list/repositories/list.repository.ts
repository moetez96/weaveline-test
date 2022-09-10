import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { List, ListDocument } from "src/schemas/list.schema";
import { CreateListData } from "../dto/createlist.dto";

@Injectable()
export class ListRepository {
    constructor(@InjectModel(List.name) private listModel: Model<ListDocument>){}
    
    async findById(listId: string): Promise<ListDocument> {
        return this.listModel.findById(listId);
    }
    
    async findOne(listFilterQuery: FilterQuery<List>): Promise<ListDocument> {
        return this.listModel.findOne(listFilterQuery);
    }
    
    async find(listFilterQuery: FilterQuery<List>): Promise<ListDocument[]> {
        return this.listModel.find(listFilterQuery);
    }

    async create(list: CreateListData): Promise<ListDocument> {
        const newList = new this.listModel(list);
        return newList.save();
    }
    async findOneAndUpdate(listFilterQuery: FilterQuery<List>, list: any): Promise<ListDocument> {
        const updatedList = await this.listModel.findOneAndUpdate(listFilterQuery, list);
        return this.listModel.findById(updatedList._id)
    }
    async findOneAndDelete(listFilterQuery: FilterQuery<List>): Promise<any> {
        await this.listModel.findOneAndDelete(listFilterQuery)
        return {message: 'list deleted'}
    }
}