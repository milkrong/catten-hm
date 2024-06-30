import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/server';
import TaskList from '@/components/task/TaskList';
import { getLocaleOnServer, useTranslation as translate } from '@/i18n/server';

const I18N_PREFIX = 'task';

export default async function TaskPage() {
  const locale = getLocaleOnServer();
  const { t } = await translate(locale, 'task');

  const supabase = createClient();

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) {
    toast({
      title: t(`${I18N_PREFIX}.fetch_error`),
      description: error.message,
      variant: 'destructive',
    });
  }

  const buttonTranslations = {
    markPending: t('mark_pending'),
    markInProgress: t('mark_in_progress'),
    markCompleted: t('mark_completed'),
    updateError: t(`${I18N_PREFIX}.update_error`),
    updateSuccess: t(`${I18N_PREFIX}.update_success`),
    taskUpdated: t('task_updated'),
  };

  const translations = {
    listOfTasks: t('list_of_tasks'),
    title: t('title'),
    description: t('description'),
    status: t('status'),
    dueDate: t('due_date'),
    actions: t('actions'),
    pending: t('pending'),
    in_progress: t('in_progress'),
    completed: t('completed'),
    addTask: t('add_task'),
    addTaskSuccess: t('add_task_success'),
    addTaskError: t('add_task_error'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('management')}</CardTitle>
        <CardDescription>{t('management_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <TaskList
          initialTasks={tasks || []}
          translations={translations}
          buttonTranslations={buttonTranslations}
        />
      </CardContent>
    </Card>
  );
}
