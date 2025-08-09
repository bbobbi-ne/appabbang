export default function SubLayout({
  children,
  title,
  subTitle,
}: {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
}) {
  return (
    <div className="container mx-auto px-2 py-2">
      {title && <h1 className="text-2xl text-center font-bold pt-4 pb-4">{title}</h1>}
      {subTitle && <h3 className="text-center relative -top-5">{subTitle}</h3>}
      {children}
    </div>
  );
}
