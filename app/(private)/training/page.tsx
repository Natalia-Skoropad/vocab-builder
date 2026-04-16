import type { Metadata } from 'next';

//===============================================================

export const metadata: Metadata = {
  title: 'Training',
};

//===============================================================

function TrainingPage() {
  return (
    <main>
      <section aria-labelledby="home-title">
        <div className="container">Hello TrainingPage</div>
      </section>
    </main>
  );
}

export default TrainingPage;
