'use client';

import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { RegisterFormValues } from '@/types/forms';
import { ROUTES } from '@/lib/constants/routes';
import { registerSchema } from '@/lib/validations/registerSchema';
import { useAuth } from '@/hooks/useAuth';

import {
  AUTH_EMAIL_MAX_LENGTH,
  AUTH_NAME_MAX_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
} from '@/lib/validations/commonFields';

import Button from '@/components/common/Button/Button';
import TextActionButton from '@/components/common/TextActionButton/TextActionButton';
import FormField from '@/components/forms/FormField/FormField';

import css from '@/components/auth/AuthForm.module.css';

//===============================================================

function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const nameValue = useWatch({
    control,
    name: 'name',
    defaultValue: '',
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
    isSubmitting ||
    !nameValue.trim() ||
    !emailValue.trim() ||
    !passwordValue.trim() ||
    !isValid;

  const handleGoToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values);
      toast.success('Registration successful!');
      router.push(ROUTES.DICTIONARY);
    } catch (error) {
      console.error('Register error:', error);

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.fields}>
        <FormField
          type="text"
          placeholder="Name"
          autoComplete="name"
          maxLength={AUTH_NAME_MAX_LENGTH}
          error={errors.name?.message}
          success={
            touchedFields.name && nameValue && !errors.name
              ? 'Success name'
              : undefined
          }
          {...register('name')}
        />

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
          autoComplete="new-password"
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
        variant={isSubmitDisabled ? 'disabled' : 'primary'}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>

      <p className={css.switchText}>
        Already have an account?{' '}
        <TextActionButton
          className={css.switchAction}
          onClick={handleGoToLogin}
        >
          Login
        </TextActionButton>
      </p>
    </form>
  );
}

export default RegisterForm;
