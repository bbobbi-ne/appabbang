import JoinForm from '@/components/join-form';

export default function JoinPage() {
  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-2xl text-center font-bold pt-4 pb-4">회원가입</h1>
      <div className="max-w-sm mx-auto">
        <JoinForm onSubmit={async () => {}} isLoading={false} />
      </div>
    </div>
  );
}
