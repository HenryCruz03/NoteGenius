import { action, makeAutoObservable, } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

export class FileViewStore {
  filesArr = [];
  selectedFile = null;
  filesLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFilesArr = action((arr) => {
    this.filesArr = arr;
  });

  setFiles = action((arr) => {
    this.filesArr = arr;
  });

  setFileLoaded = action((bool) => {
    this.filesLoaded = bool;
  });

  setSelectedFile = action((file) => {
    this.selectedFile = file;
  });

  loadFiles = action(async (userId) => {
    try {
      const res = await fetch(`/api/fetchfile?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch files");
      
      const files = await res.json();
      this.setFilesArr(files);
      this.setFileLoaded(true);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  });

  addFile = action(async (file, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const res = await fetch("api/saveFile", {
        method: "POST",
        body: formData,
      });

      const fileRes = await res.json();
      const fileData = fileRes.fileData;

      console.log(fileData);

      this.filesArr.push(fileData);
      console.log('filesArr updated with new file: ', this.filesArr);

    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  });

}