import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { ListService } from 'src/list/list.service';
import { ListRepository } from 'src/list/repositories/list.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { ContributorRepository } from 'src/list/repositories/contributor.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from 'src/model/list.schema';
import { User, UserSchema } from 'src/model/user.schema';
import { Contributor, ContributorSchema } from 'src/model/contributor.schema';
import { Note, NoteSchema } from 'src/model/note.schema';
import { NoteRepository } from './repositories/note.repository';

@Module({
   imports: [
        MongooseModule.forFeature([
            {name: List.name, schema: ListSchema}, 
            {name: User.name, schema: UserSchema},
            {name: Contributor.name, schema: ContributorSchema},
            {name: Note.name, schema: NoteSchema}
        ])], 
  providers: [
    NoteService, 
    ListService, 
    ListRepository, 
    UserRepository, 
    ContributorRepository, 
    NoteRepository],
  controllers: [NoteController]
})
export class NoteModule {}
