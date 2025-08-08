import { Card } from '@appabbang/ui';
import CardComment from './card-comment';

interface LoadingProp {
  title: string;
}

function Loading({ title }: LoadingProp) {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-2xl h-auto flex items-center justify-center">
        <CardComment
          className="ml-10 mb-2"
          type="loading"
          title="Loading ..."
          comment={`[${title}] 잠시만 기다려주세요...`}
        />
      </Card>
    </div>
  );
}

export default Loading;
