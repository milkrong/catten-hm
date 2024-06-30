'use client';

import { toast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface TaskActionButtonsProps {
  taskId: string;
  translations: {
    markPending: string;
    markInProgress: string;
    markCompleted: string;
    updateError: string;
    updateSuccess: string;
    taskUpdated: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  onStatusUpdate: () => void;
}

export default function TaskActionButtons({
  taskId,
  translations,
  status,
  onStatusUpdate,
}: TaskActionButtonsProps) {
  const supabase = createClient();

  const updateTaskStatus = async (
    status: 'pending' | 'in_progress' | 'completed'
  ) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) {
      toast({
        title: translations.updateError,
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: translations.updateSuccess,
        description: translations.taskUpdated,
      });
      onStatusUpdate();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Checkbox
          onClick={() => updateTaskStatus('pending')}
          checked={status === 'pending'}
        ></Checkbox>
        <Label>{translations.markPending}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          onClick={() => updateTaskStatus('in_progress')}
          checked={status === 'in_progress'}
        ></Checkbox>
        <Label>{translations.markInProgress}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          onClick={() => updateTaskStatus('completed')}
          checked={status === 'completed'}
        ></Checkbox>
        <Label>{translations.markCompleted}</Label>
      </div>
    </div>
  );
}
