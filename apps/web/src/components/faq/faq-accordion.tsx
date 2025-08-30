import type { IFaqAccordionProps } from '@/interface/faq-interface';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@appabbang/ui';
import FaqUnregisterDialog from './faq-unregister-dialog';
import { useCustomerStore } from '@/store/customer';

function FaqAccordion({ list, value, onValueChange }: IFaqAccordionProps) {
  const { customer } = useCustomerStore();
  const newList = customer.no ? list : list.filter((list) => !list.answer.includes('탈퇴'));

  return (
    <div className="flex items-center justify-center">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={value}
        onValueChange={onValueChange}
      >
        {list && list.length > 0
          ? newList.map((data, i) => (
              <AccordionItem key={i} value={`faq-${i + 1}`}>
                <AccordionTrigger className="cursor-pointer">
                  <p className="text-sm sm:text-base font-semibold break-keep">
                    Q. {data.question}
                  </p>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  {data.answer.includes('탈퇴') && !!customer.name ? (
                    <p>
                      {data.answer.split(/(여기)/).map((part, index) =>
                        part === '여기' ? (
                          <FaqUnregisterDialog key={index}>
                            <button key={index} className="text-blue-500 underline cursor-pointer">
                              {part}
                            </button>
                          </FaqUnregisterDialog>
                        ) : (
                          <span key={index}>{part}</span>
                        ),
                      )}
                    </p>
                  ) : (
                    <p>{data.answer}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))
          : null}
      </Accordion>
    </div>
  );
}

export default FaqAccordion;
