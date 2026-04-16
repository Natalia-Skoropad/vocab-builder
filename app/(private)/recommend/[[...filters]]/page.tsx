import type { Metadata } from 'next';

import RecommendPageClient from './RecommendPageClient';

//===============================================================

export const metadata: Metadata = {
  title: 'Recommend',
};

//===============================================================

function RecommendPage() {
  return <RecommendPageClient />;
}

export default RecommendPage;
