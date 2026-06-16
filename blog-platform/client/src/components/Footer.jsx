import React from 'react';
import { Feather } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-ink-100 dark:border-ink-800 mt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-500 dark:text-ink-400">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center h-6 w-6 rounded-md bg-primary-600 text-white">
          <Feather className="h-3.5 w-3.5" />
        </span>
        <span className="font-display font-semibold text-ink-700 dark:text-ink-200">Inkwell</span>
      </div>
      <p>A place to write, share, and discuss ideas.</p>
      <p className="font-mono text-xs">&copy; {new Date().getFullYear()} Inkwell. Built for learning &amp; portfolios.</p>
    </div>
  </footer>
);

export default Footer;
