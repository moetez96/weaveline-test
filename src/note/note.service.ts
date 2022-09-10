import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ListService } from 'src/list/list.service';
import { ContributorRepository } from 'src/list/repositories/contributor.repository';
import { ListRepository } from 'src/list/repositories/list.repository';
import { UserRepository } from 'src/shared/repository/user.repository';
import { CreateNoteData } from './dto/createNote.dto';
import { UpdateNoteData } from './dto/updateNote.dto';
import { NoteRepository } from './repositories/note.repository';

@Injectable()
export class NoteService {
    constructor(
        private listRepository : ListRepository, 
        private userRepository: UserRepository,
        private noteRepository: NoteRepository
        ){}

        async getById(userId: string, noteId: string){
            try{
                const note = await this.noteRepository.findById(noteId);
                if(!note){
                    throw new NotFoundException("list does not exist");
                }
                const list = await this.listRepository.findOne(note.list);

                if(!list){
                    return {message: 'list not found'};
                }

                const privilege = await this.contributorPrivilege(list, userId)
                if(
                    privilege === 'readonly' || 
                    privilege == 'readwrite' || 
                    list.owner.toString() === userId
                    ){
                    return note;
                }

            }catch(e){
                return {message : e.message};
            }
        }

        async create(data: CreateNoteData, userId: string, listId: string ){
            try{
                const user = await this.userRepository.findById(userId);
                const list = await this.listRepository.findById(listId);
                
                if(!list){
                    return {message: 'list not found'};
                }

                const privilege = await this.contributorPrivilege(list, userId);
                if(privilege === 'readwrite' || list.owner.toString() === userId){
                    const foundNote = await this.noteRepository.findOne({name: data.name, list: list});
                    if(foundNote){
                        throw new UnauthorizedException("list already have a note with the same name");
                    }
                    const newNote = {
                        name: data.name,
                        description: data.description,
                        list: list,
                        creator: user
                    };

                    return this.noteRepository.create(newNote);
                }
               throw new UnauthorizedException("user have readonly privilege he cannot create notes in this list");
            }catch(e){
                return {message : e.message};
            }
        }

        async update(data: UpdateNoteData, userId: string, noteId: string ){
            try{
                const note = await this.noteRepository.findById(noteId);

                if(!note){
                    throw new NotFoundException("note does not exist");
                }

                const list = await this.listRepository.findOne(note.list);
                
                if(!list){
                    throw new NotFoundException("list does not exist");
                }

                const privilege = await this.contributorPrivilege(list, userId)
                if(privilege === 'readwrite' || list.owner.toString() === userId){
                    if(data.name){
                        const foundNote = await this.noteRepository.findOne({name: data.name, list: list})
                        if(foundNote){
                            throw new UnauthorizedException("list already have a note with the same name");
                        }
                    }
                    return this.noteRepository.findOneAndUpdate(note, data);
                }
               throw new UnauthorizedException("user have readonly privilege he cannot update notes in this list");
            }catch(e){
                return {message : e.message};
            }
        }

        async delete(userId: string, noteId: string){
            try{
                const note = await this.noteRepository.findById(noteId);
                if(!note){
                    throw new NotFoundException("note does not exist");
                }

                const list = await this.listRepository.findOne(note.list);
                
                if(!list){
                    throw new NotFoundException("list does not exist");
                }

                const privilege = await this.contributorPrivilege(list, userId)
                if(privilege === 'readwrite' || list.owner.toString() === userId){
                    return this.noteRepository.findOneAndDelete(note);
                }
               throw new UnauthorizedException("user have readonly privilege he cannot delete notes in this list");
            }catch(e){
                return {message : e.message};
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
                    throw new UnauthorizedException("user is not invited on this list", "Unauthorized")
                }
                return contributorFound.privilege;
            }else{
                throw new UnauthorizedException("user is not invited on this list")
            }
        }
}
