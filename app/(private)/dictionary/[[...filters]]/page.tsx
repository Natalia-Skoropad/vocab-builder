import type { Metadata } from 'next';

import DictionaryPageClient from './DictionaryPageClient';

//===============================================================

export const metadata: Metadata = {
  title: 'Dictionary',
};

//===============================================================

function DictionaryPage() {
  return <DictionaryPageClient />;
}

export default DictionaryPage;
