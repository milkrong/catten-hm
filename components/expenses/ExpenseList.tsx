'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Expense } from '@/models/expenses';

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
  // const supabase = createClient();

  // useEffect(() => {
  //   const channel = supabase
  //     .channel('expenses_realtime')
  //     .on(
  //       'postgres_changes',
  //       { event: '*', schema: 'public', table: 'expenses' },
  //       (payload) => {
  //         if (payload.eventType === 'INSERT') {
  //           setExpenses((prev) => [payload.new as Expense, ...prev]);
  //         } else if (payload.eventType === 'DELETE') {
  //           setExpenses((prev) =>
  //             prev.filter((expense) => expense.id !== payload.old.id)
  //           );
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{tableTitleTranslations.description}</TableHead>
          <TableHead>{tableTitleTranslations.category}</TableHead>
          <TableHead>{tableTitleTranslations.amount}</TableHead>
          <TableHead>{tableTitleTranslations.platform}</TableHead>
          <TableHead>{tableTitleTranslations.date}</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
