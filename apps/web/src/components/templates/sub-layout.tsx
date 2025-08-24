import Title from '@/components/common/title';

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
      {title && <Title title={title} />}
      {subTitle && <h3 className="text-center relative -top-5">{subTitle}</h3>}
      {children}
    </div>
  );
}
