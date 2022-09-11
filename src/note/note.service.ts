import { Injectable } from '@nestjs/common';
import { ListRepository } from 'src/list/repositories/list.repository';
import { List } from 'src/model/list.schema';
import { UserRepository } from 'src/shared/repositories/user.repository';
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

        async findById(noteId: string){
            return await this.noteRepository.findById(noteId);
        }

        async findByNameAndList(data: any){
            return await this.noteRepository.findOne(data)
        }

        async create(data: CreateNoteData, list: List, userId: string ){
            const user = await this.userRepository.findById(userId);
            const newNote = {
                name: data.name,
                description: data.description,
                list: list,
                creator: user
            };
            return await this.noteRepository.create(newNote);
        }

        async update(userId: string, data: UpdateNoteData){
            return await this.noteRepository.findByIdAndUpdate(userId, data);
        }

        async delete(noteId: string){
            return await this.noteRepository.findByIdAndDelete(noteId);
        }
}
