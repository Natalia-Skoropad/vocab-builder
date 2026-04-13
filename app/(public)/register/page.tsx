import RegisterForm from '@/components/auth/RegisterForm/RegisterForm';

import css from '../auth-page.module.css';

//===========================================================================

function RegisterPage() {
  return (
    <section className={css.card}>
      <h1 className={css.title}>Register</h1>

      <p className={css.text}>
        To start using our services, please fill out the registration form
        below. All fields are mandatory:
      </p>

      <RegisterForm />
    </section>
  );
}

export default RegisterPage;
