'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Expense } from '@/models/expenses';
import { PLATFORM_LIST } from '@/constants/platform';

const expenseFormSchema = z.object({
  description: z.string().optional(),
  amount: z.number().min(0),
  category: z.enum([
    'food',
    'transportation',
    'utilities',
    'entertainment',
    'other',
  ]),
  date: z.date(),
  platform: z.string(),
});

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  initialData?: Expense;
  onCancel: () => void;
}

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

export default function ExpenseForm({
  onSubmit,
  initialData,
  onCancel,
}: ExpenseFormProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          amount: Number(initialData?.amount),
          date: new Date(initialData?.date),
        }
      : {
          description: '',
          amount: 0,
          category: 'food',
          date: new Date(),
          platform: '',
        },
  });

  const handleSubmit = async (data: ExpenseFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses.description')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('expenses.description')}
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses.amount')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('expenses.amount')}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses.category')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('expenses.category')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">
                          {t('expenses.food')}
                        </SelectItem>
                        <SelectItem value="transportation">
                          {t('expenses.transportation')}
                        </SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">
                          {t('expenses.entertainment')}
                        </SelectItem>
                        <SelectItem value="other">
                          {t('expenses.other')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses.platform')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('expenses.platform')} />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_LIST.map((platform) => (
                          <SelectItem value={platform.value}>
                            {platform[currentLocale as keyof typeof platform]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('expenses.date')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal block',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>{t('expenses.pickDate')}</span>
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
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update Expense' : 'Add Expense'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
