import css from './ProgressBar.module.css';

//===============================================================

type Props = {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
};

//===============================================================

function ProgressBar({ value, max = 100, size = 'md' }: Props) {
  const safeValue = Math.max(0, Math.min(value, max));
  const percent = max > 0 ? Math.round((safeValue / max) * 100) : 0;

  return (
    <div className={css.wrap}>
      <span className={css.value}>{percent}%</span>

      <div
        className={`${css.circle} ${size === 'sm' ? css.sm : css.md}`}
        aria-label={`Progress ${percent}%`}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={
          {
            ['--progress' as string]: `${percent}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default ProgressBar;
