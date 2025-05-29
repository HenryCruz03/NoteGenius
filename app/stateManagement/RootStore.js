import { FileViewStore } from "./FileViewStore";
import { QuizViewStore } from "./QuizViewStore";

export class RootStore {
  fileViewStore;
  
  constructor() {
    this.fileViewStore = new FileViewStore(this);
    this.quizViewStore = new QuizViewStore(this);
  }
}