import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Note, NoteDocument } from "src/model/note.schema";
import { UpdateNoteData } from "../dto/updateNote.dto";

@Injectable()
export class NoteRepository {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>){}

    async findById(noteId: string): Promise<any> {
        return this.noteModel.findById(noteId);
    }

    async findOne(noteFilterQuery: FilterQuery<Note>): Promise<NoteDocument> {
        return this.noteModel.findOne(noteFilterQuery);
    }
    
    async create(note: any): Promise<NoteDocument> {
        const newNote = new this.noteModel(note);
        return newNote.save();
    }
   
    async findByIdAndUpdate(userId: string, note: UpdateNoteData ): Promise<NoteDocument>{
        const updatedNote = await this.noteModel.findByIdAndUpdate(userId, note);
        return this.noteModel.findById(updatedNote._id)
    }

    async findOneAndUpdate(noteFilterQuery: FilterQuery<Note>, note: UpdateNoteData): Promise<NoteDocument> {
        const updatedNote = await this.noteModel.findOneAndUpdate(noteFilterQuery, note);
        return this.noteModel.findById(updatedNote._id)
    }
    async findOneAndDelete(noteFilterQuery: FilterQuery<Note>): Promise<any> {
        await this.noteModel.findOneAndDelete(noteFilterQuery)
        return {message: 'note deleted'}
    }
    async findByIdAndDelete(userId: string): Promise<any> {
        await this.noteModel.findByIdAndDelete(userId);
        return {message: 'note deleted'}
    }
    
}