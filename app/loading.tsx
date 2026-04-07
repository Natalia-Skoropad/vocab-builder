import css from './loading.module.css';

//===============================================================

function Loading() {
  return (
    <div className={css.loader} role="status" aria-live="polite">
      <div className={css.spinner} aria-hidden="true" />
      <p className={css.text}>Loading…</p>
    </div>
  );
}

export default Loading;
