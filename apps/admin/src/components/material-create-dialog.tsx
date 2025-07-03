import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import MaterialForm from './material-form';

export function MaterialCreateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">재료등록</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-xl overflow-y-auto max-h-full "
      >
        <DialogHeader>
          <DialogTitle>재료등록</DialogTitle>
        </DialogHeader>
        <DialogDescription>재료를 등록해주세요</DialogDescription>
        <MaterialForm />
      </DialogContent>
    </Dialog>
  );
}
