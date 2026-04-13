import Header from '@/components/header/Header/Header';

//===========================================================================

type Props = Readonly<{
  children: React.ReactNode;
}>;

//===========================================================================

function PrivateLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default PrivateLayout;
