import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { List } from "src/model/list.schema";
import { Note, NoteDocument } from "src/model/note.schema";
import { UpdateNoteData } from "../dto/updateNote.dto";

@Injectable()
export class NoteRepository {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>){}

    async findById(noteId: string): Promise<any> {
        return await this.noteModel.findById(noteId);
    }

    async findByList(list: any){
        return await this.noteModel.find({list: list._id});
    }

    async findOne(noteFilterQuery: FilterQuery<Note>): Promise<NoteDocument> {
        return await this.noteModel.findOne(noteFilterQuery);
    }
    
    async create(note: any): Promise<NoteDocument> {
        const newNote = new this.noteModel(note);
        return await newNote.save();
    }
   
    async findByIdAndUpdate(noteId: string, note: UpdateNoteData ): Promise<NoteDocument>{
        const updatedNote = await this.noteModel.findByIdAndUpdate(noteId, note);
        return await this.noteModel.findById(updatedNote._id)
    }

    async findOneAndUpdate(noteFilterQuery: FilterQuery<Note>, note: UpdateNoteData): Promise<NoteDocument> {
        const updatedNote = await this.noteModel.findOneAndUpdate(noteFilterQuery, note);
        return await this.noteModel.findById(updatedNote._id)
    }
    async findOneAndDelete(noteFilterQuery: FilterQuery<Note>): Promise<any> {
        return await this.noteModel.findOneAndDelete(noteFilterQuery)
    }
    async findByIdAndDelete(noteId: string): Promise<any> {
        return await this.noteModel.findByIdAndDelete(noteId);
    }
    async findByListAndDelete(listId: string){
        return await this.noteModel.deleteMany({list: listId});
    }
}