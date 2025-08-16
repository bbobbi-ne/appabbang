import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';
import React from 'react';
import { personalInfoCollectAndUsed } from '../order/guest-privacy-agreement';

function PrivacyTermsAgreedDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12 p-0"
      >
        <ScrollArea className="h-[600px] p-8">
          <DialogHeader>
            <DialogTitle hidden>약관</DialogTitle>
          </DialogHeader>
          <DialogDescription hidden>약관</DialogDescription>

          {personalInfoCollectAndUsed.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default PrivacyTermsAgreedDialog;
