import { FirebaseTodo } from '../../types/todo';
import { Request, Response } from 'express';
import { addTodo } from '../../helper/firebase';
import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (req: Request<any, unknown, FirebaseTodo>, res: Response): Promise<void> => {
  const todo = req.body;
  if (!todo.name) {
    res.status(400).send('Name is missing.');
    return;
  }

  if (typeof todo.name !== 'string') {
    res.status(400).send('name must be a string.');
    return;
  }

  if (todo.dueDate && (typeof todo.dueDate !== 'string' || !dayjs(todo.dueDate).isValid())) {
    res.status(400).send('invalid dueDate.');
    return;
  }

  const dbRes = await addTodo(todo.name, todo.dueDate);
  if (dbRes) {
    res.send(dbRes);
    return;
  }

  res.status(500).send('Something went wrong during the saving process.');
};
