import { CardDescription, CardTitle } from '@appabbang/ui';

interface CardCommentProp {
  title: string;
  comment: string;
}

function CardComment({ title, comment }: CardCommentProp) {
  return (
    <>
      <CardTitle className="mb-2">{title}</CardTitle>
      <CardDescription>{comment}</CardDescription>
    </>
  );
}

export default CardComment;
