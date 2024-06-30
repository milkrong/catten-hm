'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function MenuItem({
  menu,
}: {
  menu: { label: string; href: string };
}) {
  const { t } = useTranslation();
  const menuLabel = t(`menu.${menu.label}`);

  return (
    <div className="flex items-center">
      <Link href={menu.href}>{menuLabel}</Link>
    </div>
  );
}
