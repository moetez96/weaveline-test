import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ListRepository } from './list.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from 'src/schemas/list.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: List.name, schema: ListSchema}])], 
    controllers: [ListController],
    providers: [ListService, ListRepository]
})
export class ListModule {}
