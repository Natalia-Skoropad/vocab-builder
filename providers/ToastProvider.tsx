'use client';

import { Toaster, type Toast as HotToast } from 'react-hot-toast';

import Toast from '@/components/common/Toast/Toast';

//===============================================================

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    >
      {(t: HotToast) => (
        <Toast
          message={typeof t.message === 'string' ? t.message : ''}
          type={t.type === 'error' ? 'error' : 'success'}
          duration={t.duration}
        />
      )}
    </Toaster>
  );
}

export default ToastProvider;
