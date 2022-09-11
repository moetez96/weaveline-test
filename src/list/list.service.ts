import { Injectable } from '@nestjs/common';
import { List } from 'src/model/list.schema';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { ContributorData } from './dto/contributor.dto';
import { CreateListData } from './dto/createlist.dto';
import { ContributorRepository } from './repositories/contributor.repository';
import { ListRepository } from './repositories/list.repository';

@Injectable()
export class ListService {

    constructor(
        private listRepository : ListRepository, 
        private userRepository: UserRepository,
        private contributorRepository: ContributorRepository
        ){}
    
    async findOne(list: List){
        return await this.listRepository.findOne(list);
    }
        
    async getAll(userId: string){
        const user = await this.userRepository.findById(userId);
        return await this.listRepository.find({owner: user});
    }

    async findById(listId: string){
        return await this.listRepository.findById(listId);
    }

    async findByNameAndUser(userId: string, data: Partial<List>){
        const user = await this.userRepository.findById(userId);
        return await this.listRepository.findOne({name: data.name, owner: user});
    }

    async create(data: CreateListData, userId: string ){
        const user = await this.userRepository.findById(userId);
        const newList = {
            name: data.name,
            owner: user
        };
        return await this.listRepository.create(newList);
    }

    async update(data: CreateListData, listId: string){
        return await this.listRepository.findByIdAndUpdate(listId, data);
    }

    async delete(listId: string){
        return await this.listRepository.findByIdAndDelete(listId)
    }

    async inviteContributor(data: ContributorData, list: any, contributorId: string){
        const contributor = await this.userRepository.findById(contributorId);
        const contributorData = {
            user: contributor,
            privilege: data.privilege
        };
        const newContributor = await this.contributorRepository.create(contributorData);
        list.contributors.push(newContributor);
        const updateContributors = {contributors : list.contributors};
        return await this.listRepository.findByIdAndUpdate(list._id, updateContributors);
    }

    async removeContributor(listId: string, contributors: any){
        const updateContributors = {contributors : contributors};
        return this.listRepository.findByIdAndUpdate(listId, updateContributors);
    }

    async changeContributorPrivilege(listId: string, contributors: any){
        const updateContributors = {contributors : contributors};
            return this.listRepository.findByIdAndUpdate(listId, updateContributors);
    }

    findContributorInList(list: any, contributorId: string){
        if(list.contributors.length > 0 ){
            return list.contributors.map((contributor) => contributor.user).find((contributor) => contributor.toString() === contributorId);
        }else{
            return false;
        }
    }

   async contributorPrivilege(list : any, contributorId: string){
        if(list.contributors.length > 0 ){
            var contributorFound : any = null
            await Promise.all(list.contributors.map((contributor) => {
            if(contributor.user.toString() === contributorId){
                contributorFound = contributor
            }}));
            return contributorFound.privilege;
        }else{
            return null
        }
    } 
}
