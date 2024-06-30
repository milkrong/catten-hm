import React from 'react';
import I18N from './I18N';
import { getLocaleOnServer } from '@/i18n/server';

export type II18NServerProps = {
  children: React.ReactNode;
};

const I18NServer = ({ children }: II18NServerProps) => {
  const locale = getLocaleOnServer();

  return <I18N {...{ locale }}>{children}</I18N>;
};

export default I18NServer;
