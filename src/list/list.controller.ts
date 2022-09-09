import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AuthUser } from 'src/shared/user.decorator';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
    constructor(private listService: ListService){}
    
    @Post('create')
    @UseGuards(JwtAuthGuard)
    create(@Request() req: any){
        return req.user
    }
}
