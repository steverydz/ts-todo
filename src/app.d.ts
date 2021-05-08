declare interface Task {
  completed: boolean;
  dateAdded: Date;
  task: string;
}

declare interface State {
  tasks: Array<Task>;
}
