import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseList from '@/components/expenses/ExpenseList';
// import ExpenseSummary from "@/components/expenses/ExpenseSummary";
import { toast } from '@/components/ui/use-toast';
import { getLocaleOnServer, useTranslation as translate } from '@/i18n/server';
import { createClient } from '@/utils/supabase/server';

const I18N_PREFIX = 'expenses';

export default async function ExpensesPage() {
  const locale = getLocaleOnServer();
  const { t } = await translate(locale, 'expenses');
  const supabase = createClient();
  const { data: expenses, error } = await supabase.from('expenses').select('*');

  const tableTitleTranslations = {
    description: t('description'),
    amount: t('amount'),
    date: t('date'),
    category: t('category'),
    platform: t('platform'),
  };

  if (error) {
    toast({
      title: t(`${I18N_PREFIX}.fetch_error`),
      description: error.message,
      variant: 'destructive',
    });
  }
  console.log(expenses, 'expenses', error);
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">{t('systemTitle')}</h1>
      <ExpenseForm />
      {/* <ExpenseSummary expenses={expenses} /> */}
      <ExpenseList
        initialExpenses={expenses || []}
        tableTitleTranslations={tableTitleTranslations}
      />
    </div>
  );
}
