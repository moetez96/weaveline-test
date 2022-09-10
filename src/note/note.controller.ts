import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ValidatePayloadExistsPipe } from 'src/shared/piplines/validatepayload.pipline';
import { CreateNoteData } from './dto/createNote.dto';
import { UpdateNoteData } from './dto/updateNote.dto';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
    constructor(private noteService: NoteService){}

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    getById(@AuthUser() user: any, @Param() params){
        return this.noteService.getById(user.id,params.id);
    }

    @Post('create/:id')
    @UseGuards(JwtAuthGuard)
    create(@Body() data: CreateNoteData, @AuthUser() user: any, @Param() params){
        return this.noteService.create(data, user.id,params.id);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    update(@Body(ValidatePayloadExistsPipe) data: UpdateNoteData, @AuthUser() user: any, @Param() params){
        return this.noteService.update(data, user.id, params.id);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    delete(@AuthUser() user: any, @Param() params){
        return this.noteService.delete(user.id, params.id);
    }

}
