import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AuthUser } from 'src/shared/decorators/user.decorator';
import { ListService } from './list.service';
import { CreateListData } from './dto/createlist.dto';

@Controller('list')
export class ListController {
    constructor(private listService: ListService){}

    @Get('all')
    @UseGuards(JwtAuthGuard)
    getAll(@AuthUser() user: any){
       return this.listService.getAll(user.id);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    create(@AuthUser() user: any, @Body() data: CreateListData){
        return this.listService.create(data, user.id)
    }

    @Put("update/:id")
    @UseGuards(JwtAuthGuard)
    update(@AuthUser() user: any, @Body() data: CreateListData, @Param() params){
        return this.listService.update(data, user.id, params.id)
    }

    @Put("invite/:lid/:pid")
    @UseGuards(JwtAuthGuard)
    invite(@AuthUser() user: any, @Param() params){
        return this.listService.invite(user.id, params.lid, params.pid )
    }    
}
