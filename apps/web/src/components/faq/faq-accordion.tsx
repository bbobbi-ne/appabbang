import type { IFaqAccordionProps } from '@/interface/faq-interface';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@appabbang/ui';

function FaqAccordion({ list }: IFaqAccordionProps) {
  console.log(list);

  return (
    <div className="flex items-center- justify-center">
      <Accordion type="single" collapsible className="lg:w-[60%] mt-10" defaultValue="item-1">
        {list && list.length > 0
          ? list.map((data, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="font-bold">Q. {data.question}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{data.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))
          : null}
      </Accordion>
    </div>
  );
}

export default FaqAccordion;
