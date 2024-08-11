'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Expense } from '@/models/expenses';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ExpenseForm, { ExpenseFormData } from './ExpenseForm';
import { useUserClient } from '@/hooks/user';
import { useTranslation } from 'react-i18next';

export default function ExpenseList({
  initialExpenses,
  tableTitleTranslations,
}: {
  initialExpenses: Expense[];
  tableTitleTranslations: {
    description: string;
    amount: string;
    date: string;
    category: string;
    platform: string;
  };
}) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { userId } = useUserClient();
  const supabase = createClient();
  const { t } = useTranslation();

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expense: Expense) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expense.id);
    if (!error) {
      setExpenses(expenses.filter((e) => e.id !== expense.id));
    }
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    console.log(data, 'data');
    const formattedData = {
      ...data,
      amount: data.amount,
      date: data.date.toLocaleDateString(),
    };
    if (editingExpense) {
      const { error } = await supabase
        .from('expenses')
        .update({ ...formattedData, user_id: userId })
        .eq('id', editingExpense.id);

      if (!error) {
        setExpenses(
          expenses.map((e) =>
            e.id === editingExpense.id ? { ...e, ...formattedData } : e
          )
        );
      }
    } else {
      const { data: newExpense, error } = await supabase
        .from('expenses')
        .insert([{ ...formattedData, user_id: userId }])
        .select()
        .single();

      if (!error && newExpense) {
        setExpenses([newExpense, ...expenses]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={handleAddExpense}>Add New Expense</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tableTitleTranslations.description}</TableHead>
            <TableHead>{tableTitleTranslations.category}</TableHead>
            <TableHead>{tableTitleTranslations.amount}</TableHead>
            <TableHead>{tableTitleTranslations.platform}</TableHead>
            <TableHead>{tableTitleTranslations.date}</TableHead>
            <TableHead>{t('global.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense: Expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount}</TableCell>
              <TableCell>{expense.platform}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditExpense(expense)}>
                  {t('global.edit')}
                </Button>
                <Button
                  variant="destructive"
                  className="ml-2"
                  onClick={() => handleDeleteExpense(expense)}
                >
                  {t('global.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleSubmit}
            initialData={editingExpense || undefined}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
