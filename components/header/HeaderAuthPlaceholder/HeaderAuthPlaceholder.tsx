import css from './HeaderAuthPlaceholder.module.css';

//===============================================================

function HeaderAuthPlaceholder() {
  return (
    <div className={css.wrap} aria-hidden="true">
      <span className={css.badge} />
      <span className={css.action} />
    </div>
  );
}

export default HeaderAuthPlaceholder;
