import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { ListService } from 'src/list/list.service';
import { AuthUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ValidatePayloadExistsPipe } from 'src/shared/piplines/validatepayload.pipline';
import { CreateNoteData } from './dto/createNote.dto';
import { UpdateNoteData } from './dto/updateNote.dto';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
    constructor(private noteService: NoteService, private listService: ListService){}

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getById(@AuthUser() currentUser: any, @Param("id") noteId){
        const note = await this.noteService.findById(noteId);
        if(!note){
            throw new NotFoundException("list does not exist");
        }
        const list = await this.listService.findOne(note.list);
         if(!list){
            throw new NotFoundException("list not found");
        }
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id)
        if(
            privilege === 'readonly' || 
            privilege == 'readwrite' || 
            list.owner.toString() === currentUser.id
            ){
            return note;
        }
    }

    @Post('create/:id')
    @UseGuards(JwtAuthGuard)
    async create(@Body() data: CreateNoteData, @AuthUser() currentUser: any, @Param("id") listId){
        const list = await this.listService.findById(listId);
        if(!list){
            throw new NotFoundException("list not found");
        }
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id);
        if(privilege === 'readwrite' || list.owner.toString() === currentUser.id){
            const foundNote = await this.noteService.findByNameAndList({name: data.name, list: list});
            if(foundNote){
                throw new ForbiddenException("list already have a note with the same name");
            }
            return await this.noteService.create(data, list, currentUser.id);
        }
        if(!privilege){
            throw new UnauthorizedException("user is not invited on this list")
        }
        throw new UnauthorizedException("user have readonly privilege he cannot create notes in this list");
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Body(ValidatePayloadExistsPipe) data: UpdateNoteData, @AuthUser() currentUser: any, @Param("id") noteId){
        const note = await this.noteService.findById(noteId);
        if(!note){
            throw new NotFoundException("note does not exist");
        } 
        const list = await this.listService.findOne(note.list);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id);
        if(privilege === 'readwrite' || list.owner.toString() === currentUser.id){
            if(data.name){
                const foundNote = await this.noteService.findByNameAndList({name: data.name, list: list});
                if(foundNote){
                    throw new UnauthorizedException("list already have a note with the same name");
                }
            }
            return this.noteService.update(noteId, data);
        }
        if(!privilege){
            throw new UnauthorizedException("user is not invited on this list")
        }
        throw new UnauthorizedException("user have readonly privilege he cannot update notes in this list");
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@AuthUser() currentUser: any, @Param("id") noteId){
        const note = await this.noteService.findById(noteId);
        if(!note){
            throw new NotFoundException("note does not exist");
        }
        const list = await this.listService.findOne(note.list);  
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id)
        if(privilege === 'readwrite' || list.owner.toString() === currentUser.id){
            await this.noteService.delete(noteId);
            return {message: "deleted with success"};
        }
        throw new UnauthorizedException("user have readonly privilege he cannot delete notes in this list");
    }

}
