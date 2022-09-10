import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/shared/repository/user.repository';
import { CreateListData } from './dto/createlist.dto';
import { ListRepository } from './list.repository';

@Injectable()
export class ListService {

    constructor(
        private listRepository : ListRepository, 
        private userRepository: UserRepository
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

            if(list.owner.toString() !== user._id.toString()){
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

    async invite(userId: string, listId: string, participantId: string){
        try{
            const user = await this.userRepository.findById(userId);
            const list = await this.listRepository.findById(listId);
            if(list.owner.toString() !== user._id.toString()){
                throw new ForbiddenException("the user does not own this list")
            }
        }catch(e){
            return {message : e.message};
        }
    }
}
