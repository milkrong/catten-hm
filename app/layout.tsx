import { getLocaleOnServer } from '@/i18n/server';
import './globals.css';
import I18nServer from '@/components/I18NServer';

export const metadata = {
  title: 'Home Management',
  description: 'Home Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocaleOnServer();
  return (
    <html lang={locale ?? 'zh-CN'} className="h-full">
      <body className="bg-background text-foreground h-full w-full">
        <I18nServer>{children}</I18nServer>
      </body>
    </html>
  );
}
