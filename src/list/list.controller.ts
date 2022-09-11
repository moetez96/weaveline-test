import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AuthUser } from 'src/shared/decorators/user.decorator';
import { ListService } from './list.service';
import { CreateListData } from './dto/createlist.dto';
import { ContributorData } from './dto/contributor.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { List } from 'src/model/list.schema';

@ApiBearerAuth("accessToken")
@ApiTags('List')
@Controller('list')
export class ListController {
    constructor(private listService: ListService){}

    @ApiCreatedResponse({
        description: 'Lists found',
        type: [List]
    })
    @ApiNotFoundResponse({
        description: 'No lists found',
    })
    @Get('all')
    @UseGuards(JwtAuthGuard)
    async getAll(@AuthUser() currentUser: any){
        const lists = await this.listService.getAll(currentUser.id);
        if(lists.length > 0){
            return lists;
        }
        throw new NotFoundException("no lists found");
    }

    @ApiCreatedResponse({
        description: 'List found',
        type: List
    })
    @ApiNotFoundResponse({
        description: 'The list not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user is not the owner and is not invited to the list',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the list'
    })
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

    @ApiCreatedResponse({
        description: 'List created',
        type: List
    })
    @ApiForbiddenResponse({
        description: 'The user already have a list with the same name',
    })
    @ApiBadRequestResponse({
        description: 'The request body is not valid',
    })
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@AuthUser() currentUser: any, @Body() data: CreateListData){
        const foundList = await this.listService.findByNameAndUser(currentUser.id, data);
        if(foundList){
            throw new ForbiddenException("user already have a list with this name");
        }
        return await this.listService.create(data, currentUser.id);
    }

    @ApiCreatedResponse({
        description: 'List updated',
        type: List
    })
    @ApiNotFoundResponse({
        description: 'The list not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user does not own the list',
    })
    @ApiForbiddenResponse({
        description: 'The user already have a list with the same name',
    })
    @ApiBadRequestResponse({
        description: 'The request body is not valid',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the list'
    })
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
            throw new ForbiddenException("user already have a list with the same name");
        }
        return await this.listService.update(data, foundList._id);
    }

    @ApiCreatedResponse({
        description: 'List deleted',
        type: List
    })
    @ApiNotFoundResponse({
        description: 'The list not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user does not own the list',
    })
    @ApiParam({
        name: 'id', 
        required: true, 
        description: 'The id of the list'
    })
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

   @ApiCreatedResponse({
        description: 'Contributor added',
        type: List
    })
    @ApiNotFoundResponse({
        description: 'The list not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user does not own the list',
    })
    @ApiForbiddenResponse({
        description: 'Cannot invite the user',
    })
    @ApiParam({
        name: 'lid', 
        required: true, 
        description: 'The id of the list'
    })
    @ApiParam({
        name: 'cid', 
        required: true, 
        description: 'The id of the user'
    })
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
            throw new ForbiddenException("contributor already exist");
        }
        return await this.listService.inviteContributor(data , list, params.cid);
    }

    @ApiCreatedResponse({
        description: 'Contributor removed',
        type: List
    })
    @ApiNotFoundResponse({
        description: 'The list not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user does not own the list',
    })
    @ApiForbiddenResponse({
        description: 'The user is not in the contributors list',
    })
    @ApiParam({
        name: 'lid', 
        required: true, 
        description: 'The id of the list'
    })
    @ApiParam({
        name: 'cid', 
        required: true, 
        description: 'The id of the user'
    })
    @Delete("remove_contributor/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    async removeContributor(@AuthUser() currentUser: any, @Param() params){
        var list = await this.listService.findById(params.lid);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        if(list.owner.toString() !== currentUser.id){
            throw new UnauthorizedException("the user does not own this list");
        }
        if(!this.listService.findContributorInList(list, params.cid)){
            throw new ForbiddenException("contributor does not exist in this list");
        }
         var contributors = list.contributors.filter((contributor) => {
            return contributor.user.toString() !== params.cid
        });
        return await this.listService.removeContributor(list._id, contributors);
    }

    @ApiCreatedResponse({
        description: 'Contributor privilege changed',
        type: List
    })
    @ApiNotFoundResponse({
        description: 'The list not found',
    })
    @ApiUnauthorizedResponse({
        description: 'The user does not own the list',
    })
    @ApiForbiddenResponse({
        description: 'The user is not in the contributors list',
    })
    @ApiBadRequestResponse({
        description: 'The request body is not valid',
    })
    @ApiParam({
        name: 'lid', 
        required: true, 
        description: 'The id of the list'
    })
    @ApiParam({
        name: 'cid', 
        required: true, 
        description: 'The id of the user'
    })
    @Put("change_contributor_privilege/:lid/:cid")
    @UseGuards(JwtAuthGuard)
    async changeContributorPrivilege(@AuthUser() currentUser: any, @Body() data: ContributorData, @Param() params){
        var list = await this.listService.findById(params.lid);
        if(!list){
            throw new NotFoundException("list does not exist");
        }
        if(list.owner.toString() !== currentUser.id){
            throw new UnauthorizedException("the user does not own this list");
        }
        if(!this.listService.findContributorInList(list, params.cid)){
            throw new ForbiddenException("contributor does not exist in this list");
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
