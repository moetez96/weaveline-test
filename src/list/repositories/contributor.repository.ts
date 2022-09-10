import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contributor, ContributorDocument } from "src/schemas/contributor.schema";

@Injectable()
export class ContributorRepository {
    constructor(@InjectModel(Contributor.name) private contributorModel: Model<ContributorDocument>){}

    async create(contributor: any): Promise<ContributorDocument> {
        const newContributor = new this.contributorModel(contributor);
        return newContributor;
    }
    
}