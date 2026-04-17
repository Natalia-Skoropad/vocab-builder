import type { Metadata } from 'next';
import TrainingPageClient from './TrainingPageClient';

//===============================================================

export const metadata: Metadata = {
  title: 'Training',
};

//===============================================================

function TrainingPage() {
  return <TrainingPageClient />;
}

export default TrainingPage;
