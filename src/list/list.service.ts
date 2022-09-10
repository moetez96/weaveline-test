import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    async getAll(userId: string){
        try{
            const user = await this.userRepository.findById(userId);
            const lists = await this.listRepository.find({owner: user});
            if(lists.length > 0){
                return lists;
            }else{
                return {message: 'no lists yet'}
            }
        }catch(e){
            return {message : e.message};
        }
    }

    async getById(listId: string, userId : string){
        try{
            const list = await this.listRepository.findById(listId);
            
            if(!list){
                return {message: 'list not found'}
            }

            const privilege = await this.contributorPrivilege(list, userId)
            if(privilege == 'readonly' || privilege == 'readwrite' || list.owner.toString() === userId){
                return list
            }

        }catch(e){
            return {message : e.message};
        }
    }

    async create(data: CreateListData, userId: string ){
        try{
            const user = await this.userRepository.findById(userId);
            const foundList = await this.listRepository.findOne({name: data.name, owner: user});
            if(foundList){
                throw new UnauthorizedException("user already have a list with this name")
            }
            const newList = {
                name: data.name,
                owner: user
            }
            return this.listRepository.create(newList)
        }catch(e){
            return {message : e.message};
        }
    }

    async update(data: CreateListData, userId: string, listId: string ){
        try{
            const user = await this.userRepository.findById(userId);
            const list = await this.listRepository.findById(listId);
            if(!list){
                throw new NotFoundException("list does not exist");
            }
            if(list.owner.toString() !== userId){
                throw new ForbiddenException("the user does not own this list")
            }
            const foundList = await this.listRepository.findOne({name: data.name, owner: user});
            if(foundList){
                throw new UnauthorizedException("user already have a list with this name")
            }
            const updateList = {
                name: data.name,
            }
            return this.listRepository.findOneAndUpdate(list, updateList)
        }catch(e){
            return {message : e.message};
        }
    }

    async delete(userId: string, listId: string){
        try{
            const user = await this.userRepository.findById(userId);
            const list = await this.listRepository.findById(listId);
            if(!list){
                throw new NotFoundException("list does not exist");
            }
            if(list.owner.toString() !== userId){
                throw new ForbiddenException("the user does not own this list")
            }
            return this.listRepository.findOneAndDelete(list)
        }catch(e){
            return {message : e.message};
        }
    }

    async inviteContributor(userId: string, data: ContributorData, listId: string, contributorId: string){
        try{
            var list = await this.listRepository.findById(listId);
            if(!list){
                throw new NotFoundException("list does not exist");
            }
            if(list.owner.toString() !== userId){
                throw new ForbiddenException("the user does not own this list");
            }
            if(this.findContributorInList(list, contributorId)){
                throw new ForbiddenException("contributor already exist");
            }
            const contributor = await this.userRepository.findById(contributorId);
            const contributorData = {
                user: contributor,
                privilege: data.privilege
            };
            const newContributor = await this.contributorRepository.create(contributorData);
            list.contributors.push(newContributor);
            const updateContributors = {contributors : list.contributors};
            return this.listRepository.findOneAndUpdate(list, updateContributors);
        }catch(e){
            return {message : e.message};
        }
    }

    async removeContributor(userId: string, listId: string, contributorId: string){
        try{
            var list = await this.listRepository.findById(listId);
            if(!list){
                throw new NotFoundException("list does not exist");
            }
            if(list.owner.toString() !== userId){
                throw new ForbiddenException("the user does not own this list");
            }
            if(!this.findContributorInList(list, contributorId)){
                throw new ForbiddenException("contributor does not exist in this list");
            }
            var contributors = list.contributors.filter((contributor) => {
                console.log(contributor.user.toString() !== contributorId)
                return contributor.user.toString() !== contributorId
            });
            const updateContributors = {contributors : contributors};
            return this.listRepository.findOneAndUpdate(list, updateContributors);
        }catch(e){
            return {message : e.message};
        }
    }

    async changeContributorPrivilege(userId: string, data: ContributorData, listId: string, contributorId: string){
        try{
            var list = await this.listRepository.findById(listId);
            if(!list){
                throw new NotFoundException("list does not exist");
            }
            if(list.owner.toString() !== userId){
                throw new ForbiddenException("the user does not own this list");
            }
             if(!this.findContributorInList(list, contributorId)){
                throw new ForbiddenException("contributor does not exist in this list");
            }
            const contributors = list.contributors.map((contributor) => {
                if(contributor.user.toString() === contributorId){
                    contributor.privilege = data.privilege 
                }
                return contributor
                
            });
            const updateContributors = {contributors : contributors};
            return this.listRepository.findOneAndUpdate(list, updateContributors);
        }catch(e){
            return {message : e.message};
        }
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
               }
            }))
            if(!contributorFound){
                throw new UnauthorizedException("user is not invited on this list")
            }
            return contributorFound.privilege;
        }else{
            throw new UnauthorizedException("user is not invited on this list")
        }
    }
}
