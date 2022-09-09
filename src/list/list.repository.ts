import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { List, ListDocument } from "src/schemas/list.schema";
import { ListData } from "./dto/createlist.dto";

@Injectable()
export class ListRepository {
    constructor(@InjectModel(List.name) private listModel: Model<ListDocument>){}
    
    async findOne(listFilterQuery: FilterQuery<List>): Promise<ListDocument> {
        return this.listModel.findOne(listFilterQuery);
    }
    
    async find(listFilterQuery: FilterQuery<List>): Promise<ListDocument[]> {
        return this.listModel.find(listFilterQuery);
    }

    async create(list: ListData): Promise<ListDocument> {
        const newList = new this.listModel(list);
        return newList.save();
    }
    async findOneAndUpdate(listFilterQuery: FilterQuery<List>, list: Partial<List>): Promise<ListDocument> {
        return this.listModel.findOneAndUpdate(listFilterQuery, list)
    }
}