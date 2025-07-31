export default function SubLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="container mx-auto px-2 py-2">
      {title && <h1 className="text-2xl text-center font-bold pt-4 pb-4">{title}</h1>}
      {children}
    </div>
  );
}
