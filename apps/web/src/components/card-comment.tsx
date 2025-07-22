import { CardContent, CardDescription, CardTitle } from '@appabbang/ui';
import { Spinner } from 'basic-loading';

interface CardCommentProp {
  title: string;
  comment: string;
  type?: string;
  className?: string;
}

function CardComment({ title, comment, type, ...props }: CardCommentProp) {
  const option = {
    size: 50,
    barColor: '#393028',
    bgColor: '#ffe0c2',
  };

  return (
    <>
      <CardTitle {...props}>{title}</CardTitle>

      {type === 'loading' ? (
        <div className="m-5">
          <Spinner option={option} />
        </div>
      ) : null}

      <CardContent className="p-2">
        <CardDescription>{comment}</CardDescription>
      </CardContent>
    </>
  );
}

export default CardComment;
