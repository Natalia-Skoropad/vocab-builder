import LoginForm from '@/components/auth/LoginForm/LoginForm';

import css from '../auth-page.module.css';

//===========================================================================

function LoginPage() {
  return (
    <section className={css.card}>
      <h1 className={css.title}>Login</h1>

      <p className={css.text}>
        Please enter your login details to continue using our service:
      </p>

      <LoginForm />
    </section>
  );
}

export default LoginPage;
