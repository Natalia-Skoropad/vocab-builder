'use client';

import Button from '@/components/common/Button/Button';
import CloseButton from '@/components/common/CloseButton/CloseButton';
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
        <CloseButton className={css.closeButton} onClick={onClose} />

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
                <li className={css.item}>No correct answers</li>
              )}
            </ul>
          </div>

          <div className={css.column}>
            <p className={css.columnTitle}>Mistakes:</p>

            <ul className={css.list}>
              {mistakes.map((item) => (
                <li key={`${item._id}-${item.task}`} className={css.item}>
                  {item.task === 'en' ? item.en : item.ua}
                </li>
              ))}
              <ul className={css.list}>
                {correctAnswers.length ? (
                  correctAnswers.map((item) => (
                    <li key={`${item._id}-${item.task}`} className={css.item}>
                      {item.task === 'en' ? item.en : item.ua}
                    </li>
                  ))
                ) : (
                  <li className={css.item}>No correct answers</li>
                )}
              </ul>
            </ul>
          </div>
        </div>

        <div className={css.actions}>
          <Button type="button" variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}

export default WellDoneModal;
