import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    async getAll(@AuthUser() currentUser: any){
        const lists = await this.listService.getAll(currentUser.id);
        if(lists.length > 0){
            return lists;
        }
        throw new NotFoundException("no lists found");
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getById(@AuthUser() currentUser: any, @Param('id') listId){
        const list = await this.listService.findById(listId);
        if(!list){
            throw new NotFoundException("list not found");
        }
        const privilege = await this.listService.contributorPrivilege(list, currentUser.id);
        if(
            privilege == 'readonly' || 
            privilege == 'readwrite' || 
            list.owner.toString() === currentUser.id){
            return list;
        }
        if(!privilege){
            throw new UnauthorizedException("user is not invited on this list")
        }
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@AuthUser() currentUser: any, @Body() data: CreateListData){
        const foundList = await this.listService.findByNameAndUser(currentUser.id, data);
        if(foundList){
            throw new BadRequestException("user already have a list with this name");
        }
        return await this.listService.create(data, currentUser.id);
    }

    @Put("update/:id")
    @UseGuards(JwtAuthGuard)
    async update(@AuthUser() currentUser: any, @Body() data: CreateListData, @Param('id') listId){
        const foundList = await this.listService.findById(listId);
        if(!foundList){
            throw new NotFoundException("list does not exist");
        }
        if(foundList.owner.toString() !== currentUser.id){
            throw new UnauthorizedException("the user does not own this list");
        }
        if(foundList.name === data.name){
            throw new BadRequestException("user already have a list with the same name");
        }
        return await this.listService.update(data, foundList._id);
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard)
    async delete(@AuthUser() currentUser: any, @Param("id") listId){
        const list = await this.listService.findById(listId);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        if(list.owner.toString() !== currentUser.id){
            throw new UnauthorizedException("the user does not own this list");
        }
        await this.listService.delete(listId);
        return {message: "deleted with success"};
    }

    @Put("invite/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    async inviteContributor(@AuthUser() currentUser: any, @Body() data: ContributorData, @Param() params){
        var list = await this.listService.findById(params.lid);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        if(list.owner.toString() !== currentUser.id){
            throw new UnauthorizedException("the user does not own this list");
        }
        if(currentUser.id === params.cid){
            throw new ForbiddenException("the user cannot invite himself");
        }
        if(this.listService.findContributorInList(list, params.cid)){
            throw new UnauthorizedException("contributor already exist");
        }
        return await this.listService.inviteContributor(data , list, params.cid);
    }

    @Delete("remove_contributor/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    async removeContributor(@AuthUser() currentUser: any, @Param() params){
        var list = await this.listService.findById(params.lid);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        console.log(currentUser.id, list.owner.toString() )
        if(list.owner.toString() !== currentUser.id){
            throw new ForbiddenException("the user does not own this list");
        }
        if(!this.listService.findContributorInList(list, params.cid)){
            throw new ForbiddenException("contributor does not exist in this list");
        }
         var contributors = list.contributors.filter((contributor) => {
            return contributor.user.toString() !== params.cid
        });
        return await this.listService.removeContributor(list._id, contributors);
    }

    @Put("change_contributor_privilege/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    async changeContributorPrivilege(@AuthUser() currentUser: any, @Body() data: ContributorData, @Param() params){
        var list = await this.listService.findById(params.lid);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        if(list.owner.toString() !== currentUser.id){
            throw new ForbiddenException("the user does not own this list");
        }
        if(!this.listService.findContributorInList(list, params.cid)){
            throw new NotFoundException("contributor does not exist in this list");
        }
        const contributors = list.contributors.map((contributor) => {
            if(contributor.user.toString() === params.cid){
                contributor.privilege = data.privilege;
            }
            return contributor
         });
        
        return await this.listService.changeContributorPrivilege(list._id, contributors);
         
    }

}
