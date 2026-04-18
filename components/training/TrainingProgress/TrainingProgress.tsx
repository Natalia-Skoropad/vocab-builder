import css from './TrainingProgress.module.css';

//===============================================================

type Props = {
  current: number;
  total: number;
};

//===============================================================

function TrainingProgress({ current, total }: Props) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.max(0, Math.min(current, safeTotal));
  const percent = Math.round((safeCurrent / safeTotal) * 100);
  const circumference = 2 * Math.PI * 22;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div className={css.wrap} aria-label={`Progress ${percent}%`}>
      <span className={css.value}>{safeCurrent}</span>

      <svg
        className={css.circle}
        viewBox="0 0 52 52"
        role="presentation"
        aria-hidden="true"
      >
        <circle className={css.track} cx="26" cy="26" r="22" />
        <circle
          className={css.progress}
          cx="26"
          cy="26"
          r="22"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
    </div>
  );
}

export default TrainingProgress;
