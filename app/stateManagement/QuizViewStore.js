import { action, makeAutoObservable, } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

export class QuizViewStore {
  root;
  quizContent = [];
  userAnswers = [];
  difficulty = "easy";
  numQuestions = 5;
  loading = false
  isSubmitted = false;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setLoading = action((bool) => {
    this.loading = bool;
  })

  setIsSubmitted = action((bool) => {
    this.isSubmitted = bool;
  })

  setQuizContent = action((arr) => {
    this.quizContent = arr;
  });

  setUserAnswers = action((arr) => {
    this.userAnswers = arr;
  });

  setDifficulty = action((str) => {
    this.difficulty = str;
  });

  setNumQuestions = action((val) => {
    this.numQuestions = val;
  })

  selectAnswerChoice = action((val, idx) => {
    this.userAnswers[idx] = val;
  })

  generateQuiz = action(async () => {
    try {
      this.loading = true;
      const formData = new FormData();
      formData.append("txtId", this.root.fileViewStore.selectedFile.txtId);
      formData.append("uid", this.root.fileViewStore.selectedFile.uid);
      formData.append("numQuestions", this.numQuestions);
      formData.append("difficulty", this.difficulty);

      const res = await fetch("api/quizGenerator", {
        method: "POST",
        body: formData,
      });

      if (res.status === 500) {
        throw new Error(res.error);
      }
      const response = await res.json();
      const quizContent = response.quiz;
    
      this.setQuizContent(quizContent);
      this.setUserAnswers(this.quizContent.map(() => 1));
    } catch (error) {
      console.error('Failed to generate quiz content:', error);
    } finally {
      this.loading = false;
    }
  });

  resetQuiz = action(() => {
    this.quizContent = [];
    this.userAnswers = [];
    this.difficulty = "easy";
    this.numQuestions = 5;
    this.isSubmitted = false;
  });

}