import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Contributor, ContributorDocument } from "src/schemas/contributor.schema";
import { Note, NoteDocument } from "src/schemas/note.schema";

@Injectable()
export class NoteRepository {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>){}

    async findById(noteId: string): Promise<NoteDocument> {
        return this.noteModel.findById(noteId);
    }

    async findOne(noteFilterQuery: FilterQuery<Note>): Promise<NoteDocument> {
        return this.noteModel.findOne(noteFilterQuery);
    }
    
    async create(note: any): Promise<NoteDocument> {
        const newNote = new this.noteModel(note);
        return newNote.save();
    }
   

    async findOneAndUpdate(noteFilterQuery: FilterQuery<Note>, note: any): Promise<NoteDocument> {
        const updatedNote = await this.noteModel.findOneAndUpdate(noteFilterQuery, note);
        return this.noteModel.findById(updatedNote._id)
    }
    async findOneAndDelete(noteFilterQuery: FilterQuery<Note>): Promise<any> {
        await this.noteModel.findOneAndDelete(noteFilterQuery)
        return {message: 'note deleted'}
    }
    
}