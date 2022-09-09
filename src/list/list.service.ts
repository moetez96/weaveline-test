import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ListData } from './dto/createlist.dto';
import { ListRepository } from './list.repository';

@Injectable()
export class ListService {
    constructor(private listRepository : ListRepository){}

    async create(userId: Types.ObjectId, data: ListData){
        try{
            
        }catch(e){

        }
    }
}
