export type TrainingTask = {
  _id: string;
  en?: string;
  ua?: string;
  task: 'en' | 'ua';
};

export type TrainingTasksResponse = {
  tasks: TrainingTask[];
};

export type TrainingAnswer = {
  _id: string;
  en: string;
  ua: string;
  task: 'en' | 'ua';
};

export type TrainingSubmitPayload = TrainingAnswer[];

export type TrainingResultItem = {
  _id: string;
  en: string;
  ua: string;
  task: 'en' | 'ua';
  isDone: boolean;
};

export type TrainingSubmitResponse = TrainingResultItem[];
