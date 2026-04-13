type Props = Readonly<{
  children: React.ReactNode;
}>;

//===========================================================================

function PublicLayout({ children }: Props) {
  return <main>{children}</main>;
}

export default PublicLayout;
