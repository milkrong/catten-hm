'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '../ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useEffect, useState } from 'react';

const taskFormSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  due_date: z.date(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export default function TaskForm({ onTaskAdded }: { onTaskAdded: () => void }) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);
  const supabaseClient = createClient();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      due_date: new Date(),
    },
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUserId();
  }, []);

  async function onSubmit(data: TaskFormData) {
    if (!userId) {
      toast({
        title: t('auth.not_authenticated'),
        description: t('auth.please_login'),
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabaseClient
      .from('tasks')
      .insert([{ ...data, user_id: userId }]);

    if (error) {
      console.error('Error inserting task:', error);
      toast({
        title: t('task.add_error'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('task.add_success'),
      });
      form.reset();
      onTaskAdded();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('task.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('task.title')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('task.description')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('task.description')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('task.due_date')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) => date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t('task.add')}</Button>
      </form>
    </Form>
  );
}
