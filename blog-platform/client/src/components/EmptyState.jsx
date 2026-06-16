import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, message, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <span className="flex items-center justify-center h-14 w-14 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400 mb-4">
      <Icon className="h-6 w-6" />
    </span>
    <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-ink-100 mb-1">{title}</h3>
    {message && <p className="text-sm text-ink-500 dark:text-ink-400 max-w-sm mb-4">{message}</p>}
    {action}
  </div>
);

export default EmptyState;
