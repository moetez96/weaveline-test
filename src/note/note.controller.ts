import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ListService } from 'src/list/list.service';
import { Note } from 'src/model/note.schema';
import { AuthUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ValidatePayloadExistsPipe } from 'src/shared/piplines/validatepayload.pipline';
import { CreateNoteData } from './dto/createNote.dto';
import { UpdateNoteData } from './dto/updateNote.dto';
import { NoteService } from './note.service';

@ApiBearerAuth("accessToken")
@ApiTags('Notes')
@Controller('note')
export class NoteController {
    constructor(private noteService: NoteService, private listService: ListService){}

    @ApiCreatedResponse({
        description: 'Note found',
        type: [Note]
    })
    @ApiNotFoundResponse({
        description: 'List/Note not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user cannot see notes in this list',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the note'
    })
    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getById(@AuthUser() currentUser: any, @Param("id") noteId){
        const note = await this.noteService.findById(noteId);
        if(!note){
            throw new NotFoundException("note does not exist");
        }
        const list = await this.listService.findById(note.list._id);
         if(!list){
            throw new NotFoundException("list not found");
        }
        console.log(list.owner.toString(), currentUser.id)
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id)
        if(
            privilege === 'readonly' || 
            privilege === 'readwrite' || 
            list.owner.toString() === currentUser.id
            ){
            return note;
        }
        if(!privilege){
            throw new UnauthorizedException("user is not invited on this list")
        }
    }
    @ApiCreatedResponse({
        description: 'Note created',
        type: Note
    })
    @ApiNotFoundResponse({
        description: 'List not found',
    })
    @ApiForbiddenResponse({
        description: 'List have a note with the same name',
    })
    @ApiBadRequestResponse({
        description: 'The request body is not valid',
    })
    @ApiUnauthorizedResponse({
        description: 'The user cannot create notes in this list',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the list'
    })
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
    
    @ApiCreatedResponse({
        description: 'Note updated',
        type: Note
    })
    @ApiNotFoundResponse({
        description: 'List/Note not found',
    })
    @ApiForbiddenResponse({
        description: 'List have a note with the same name',
    })
    @ApiBadRequestResponse({
        description: 'The request body is not valid',
    })
    @ApiUnauthorizedResponse({
        description: 'The user cannot update notes in this list',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the note'
    })
    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Body(ValidatePayloadExistsPipe) data: UpdateNoteData, @AuthUser() currentUser: any, @Param("id") noteId){
        const note = await this.noteService.findById(noteId);
        if(!note){
            throw new NotFoundException("note does not exist");
        } 
        const list = await this.listService.findById(note.list._id);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id);
        if(privilege === 'readwrite' || list.owner.toString() === currentUser.id){
            if(data.name){
                const foundNote = await this.noteService.findByNameAndList({name: data.name, list: list});
                if(foundNote){
                    throw new ForbiddenException("list already have a note with the same name");
                }
            }
            return this.noteService.update(noteId, data);
        }
        if(!privilege){
            throw new UnauthorizedException("user is not invited on this list")
        }
        throw new UnauthorizedException("user have readonly privilege he cannot update notes in this list");
    }

    @ApiCreatedResponse({
        description: 'Note deleted',
    })
    @ApiNotFoundResponse({
        description: 'List/Note not found',
    })
    @ApiBadRequestResponse({
        description: 'The request body is not valid',
    })
    @ApiUnauthorizedResponse({
        description: 'The user cannot delete notes in this list',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the note'
    })
    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@AuthUser() currentUser: any, @Param("id") noteId){
        const note = await this.noteService.findById(noteId);
        if(!note){
            throw new NotFoundException("note does not exist");
        }
        const list = await this.listService.findById(note.list._id);
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
