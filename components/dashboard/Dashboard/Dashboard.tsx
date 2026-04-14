import Link from 'next/link';
import clsx from 'clsx';
import { Plus, ArrowRight } from 'lucide-react';

import { ROUTES } from '@/lib/constants/routes';

import Filters from '@/components/dashboard/Filters/Filters';
import Statistics from '@/components/dashboard/Statistics/Statistics';

import css from './Dashboard.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
  totalCount?: number;
  showAddWord?: boolean;
  showTrainLink?: boolean;
  onAddWord?: () => void;
  className?: string;
};

//===============================================================

function Dashboard({
  variant,
  totalCount = 0,
  showAddWord = false,
  showTrainLink = true,
  onAddWord,
  className,
}: Props) {
  return (
    <div className={clsx(css.dashboard, className)}>
      <div className={css.filtersWrap}>
        <Filters variant={variant} />
      </div>

      <div className={css.actionsWrap}>
        <Statistics totalCount={totalCount} />

        {showAddWord ? (
          <button
            type="button"
            className={css.actionButton}
            onClick={onAddWord}
            aria-label="Add word"
          >
            <span>Add word</span>
            <Plus className={css.actionIcon} aria-hidden="true" />
          </button>
        ) : null}

        {showTrainLink ? (
          <Link href={ROUTES.TRAINING} className={css.actionLink}>
            <span>Train oneself</span>
            <ArrowRight className={css.actionIcon} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default Dashboard;
