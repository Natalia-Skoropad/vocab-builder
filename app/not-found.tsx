import css from './shared-hero.module.css';

//===========================================================================

function NotFound() {
  return (
    <main className={css.page}>
      <section aria-labelledby="not-found-title">
        <div className="container">Hello</div>
      </section>
    </main>
  );
}

export default NotFound;
