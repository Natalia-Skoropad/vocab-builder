'use client';

import Image from 'next/image';

import ModalBase from '@/components/modals/ModalBase/ModalBase';

import type { TrainingSubmitResponse } from '@/types/training';

import css from './WellDoneModal.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  result: TrainingSubmitResponse;
  onClose: () => void;
};

//===============================================================

function WellDoneModal({ isOpen, result, onClose }: Props) {
  const correctAnswers = result.filter((item) => item.isDone);
  const mistakes = result.filter((item) => !item.isDone);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} ariaLabel="Well done modal">
      <div className={css.content}>
        <h2 className={css.title}>Well done</h2>

        <div className={css.columns}>
          <div className={css.column}>
            <p className={css.columnTitle}>Correct answers:</p>

            <ul className={css.list}>
              {correctAnswers.length ? (
                correctAnswers.map((item) => (
                  <li key={`${item._id}-${item.task}`} className={css.item}>
                    {item.task === 'en' ? item.en : item.ua}
                  </li>
                ))
              ) : (
                <li className={css.item}>—</li>
              )}
            </ul>
          </div>

          <div className={css.column}>
            <p className={css.columnTitle}>Mistakes:</p>

            <ul className={css.list}>
              {mistakes.length ? (
                mistakes.map((item) => (
                  <li key={`${item._id}-${item.task}`} className={css.item}>
                    {item.task === 'en' ? item.en : item.ua}
                  </li>
                ))
              ) : (
                <li className={css.item}>—</li>
              )}
            </ul>
          </div>
        </div>

        <div className={css.imageWrap} aria-hidden="true">
          <Image
            src="/well-done-book.png"
            alt=""
            width={220}
            height={180}
            className={css.image}
            priority
          />
        </div>
      </div>
    </ModalBase>
  );
}

export default WellDoneModal;
