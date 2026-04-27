import css from './HeaderNavPlaceholder.module.css';

//===============================================================

function HeaderNavPlaceholder() {
  return (
    <div className={css.navPlaceholder} aria-hidden="true">
      <span className={css.item} />
      <span className={css.item} />
      <span className={css.item} />
      <span className={css.item} />
    </div>
  );
}

export default HeaderNavPlaceholder;
