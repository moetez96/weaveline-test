import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ListRepository } from './repositories/list.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from 'src/model/list.schema';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { User, UserSchema } from 'src/model/user.schema';
import { Contributor, ContributorSchema } from 'src/model/contributor.schema';
import { ContributorRepository } from './repositories/contributor.repository';
import { UserService } from 'src/shared/services/user.service';
import { NoteRepository } from 'src/note/repositories/note.repository';
import { NoteService } from 'src/note/note.service';
import { Note, NoteSchema } from 'src/model/note.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: List.name, schema: ListSchema}, 
            {name: User.name, schema: UserSchema},
            {name: Note.name, schema: NoteSchema},
            {name: Contributor.name, schema: ContributorSchema}
        ])], 
    controllers: [ListController],
    providers: [ListService, UserService, ListRepository, UserRepository, ContributorRepository, NoteRepository, NoteService]
})
export class ListModule {}
