'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TaskActions from './TaskActions';
import TaskForm from './TaskForm';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
}

interface TaskListClientProps {
  initialTasks: Task[];
  translations: {
    listOfTasks: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    actions: string;
    [key: string]: string; // for status translations
  };
  buttonTranslations: {
    markPending: string;
    markInProgress: string;
    markCompleted: string;
    updateError: string;
    updateSuccess: string;
    taskUpdated: string;
  };
}

export default function TaskListClient({
  initialTasks,
  translations,
  buttonTranslations,
}: TaskListClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const supabase = createClient();

  const refreshTasks = useCallback(async () => {
    const { data: refreshedTasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (!error && refreshedTasks) {
      setTasks(refreshedTasks);
    }
  }, [supabase]);

  return (
    <div>
      <TaskForm onTaskAdded={refreshTasks} />
      <Table>
        <TableCaption>{translations.listOfTasks}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{translations.title}</TableHead>
            <TableHead>{translations.description}</TableHead>
            <TableHead>{translations.status}</TableHead>
            <TableHead>{translations.dueDate}</TableHead>
            <TableHead>{translations.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{translations[task.status]}</TableCell>
              <TableCell>{task.due_date}</TableCell>
              <TableCell>
                <TaskActions
                  taskId={task.id}
                  status={
                    task.status as 'pending' | 'in_progress' | 'completed'
                  }
                  translations={buttonTranslations}
                  onStatusUpdate={refreshTasks}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
