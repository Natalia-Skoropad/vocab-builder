'use client';

import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuth';
import type { LoginFormValues } from '@/types/forms';
import { ROUTES } from '@/lib/constants/routes';
import { loginSchema } from '@/lib/validations/loginSchema';

import {
  AUTH_EMAIL_MAX_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
} from '@/lib/validations/commonFields';

import Button from '@/components/common/Button/Button';
import TextActionButton from '@/components/common/TextActionButton/TextActionButton';
import FormField from '@/components/auth/FormField/FormField';

import css from '@/components/auth/shared/AuthForm.module.css';

//===============================================================

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = useWatch({
    control,
    name: 'email',
    defaultValue: '',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const isSubmitDisabled =
    isSubmitting || !emailValue.trim() || !passwordValue.trim() || !isValid;

  const handleGoToRegister = () => {
    router.push(ROUTES.REGISTER);
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      toast.success('Logged in successfully!');
      router.push(ROUTES.DICTIONARY);
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.fields}>
        <FormField
          type="email"
          placeholder="Email"
          autoComplete="email"
          maxLength={AUTH_EMAIL_MAX_LENGTH}
          error={errors.email?.message}
          success={
            touchedFields.email && emailValue && !errors.email
              ? 'Success email'
              : undefined
          }
          {...register('email')}
        />

        <FormField
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          maxLength={AUTH_PASSWORD_MAX_LENGTH}
          error={errors.password?.message}
          success={
            touchedFields.password && passwordValue && !errors.password
              ? 'Success password'
              : undefined
          }
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        className={css.submitBtn}
        disabled={isSubmitDisabled}
        variant={isSubmitDisabled ? 'disabledAuth' : 'primary'}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>

      <p className={css.switchText}>
        Don&apos;t have an account?{' '}
        <TextActionButton
          className={css.switchAction}
          onClick={handleGoToRegister}
        >
          Register
        </TextActionButton>
      </p>
    </form>
  );
}

export default LoginForm;
