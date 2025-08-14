/**
 * 아빠빵 서비스 이용약관 모달
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';
import { termsOfService } from '../order/guest-privacy-agreement';
import React from 'react';

function ServiceTermsAgreedDialog({ children }: { children: React.ReactNode }) {
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

          {termsOfService.split('\n').map((line, idx) => (
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

export default ServiceTermsAgreedDialog;
