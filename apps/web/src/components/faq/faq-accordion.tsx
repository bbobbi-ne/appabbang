import type { IFaqAccordionProps } from '@/interface/faq-interface';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@appabbang/ui';
import FaqUnregisterDialog from './faq-unregister-dialog';

function FaqAccordion({ list }: IFaqAccordionProps) {
  // 회원가입
  const onClick = () => {};

  return (
    <div className="flex items-center- justify-center">
      <Accordion type="single" collapsible className="lg:w-[60%] mt-10 " defaultValue="item-1">
        {list && list.length > 0
          ? list.map((data, i) => (
              <AccordionItem key={i} value={`item-${i + 1}`}>
                <AccordionTrigger className="font-bold cursor-pointer">
                  Q. {data.question}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  {data.answer.includes('탈퇴') ? (
                    <p>
                      {data.answer.split(/(여기)/).map((part, index) =>
                        part === '여기' ? (
                          <FaqUnregisterDialog>
                            <span
                              key={index}
                              onClick={onClick}
                              className="text-blue-500 underline cursor-pointer"
                            >
                              {part}
                            </span>
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
