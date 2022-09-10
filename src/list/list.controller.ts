import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AuthUser } from 'src/shared/decorators/user.decorator';
import { ListService } from './list.service';
import { CreateListData } from './dto/createlist.dto';
import { ContributorData } from './dto/contributor.dto';

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

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard)
    delete(@AuthUser() user: any, @Param() params){
        return this.listService.delete(user.id, params.id )
    }

    @Put("invite/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    inviteContributor(@AuthUser() user: any,@Body() data: ContributorData, @Param() params){
        return this.listService.inviteContributor(user.id,data , params.lid, params.cid )
    }
    @Delete("remove_contributor/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    removeContributor(@AuthUser() user: any, @Param() params){
        return this.listService.removeContributor(user.id, params.lid, params.cid )
    }

    @Put("change_contributor_privilege/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    changeContributorPrivilege(@AuthUser() user: any,@Body() data: ContributorData , @Param() params){
        return this.listService.changeContributorPrivilege(user.id,data , params.lid, params.cid )
    }
    
    
}
