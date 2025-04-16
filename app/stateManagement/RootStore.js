import { FileViewStore } from "./FileViewStore";

export class RootStore {
  fileViewStore;
  
  constructor() {
    this.fileViewStore = new FileViewStore(this);
  }
}