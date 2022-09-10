import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/shared/repositories/user.repository';

import { User } from 'src/model/user.schema';
import { RegisterData } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository){}
    
    async findOne(data: Partial<User>){
        return await this.userRepository.findOne(data);
    }

    async findById(userId: string){
        return await this.userRepository.findById(userId);
    }

    async create(data: RegisterData){
        return await this.userRepository.create(data)
    }
    
}
