/**
 * 자주묻는질문
 */

import { useEffect, useState } from 'react';
import FaqMenuButton from '@/components/faq/faq-menu-button';
import { faqList } from '@/components/faq/faq-data';
import type { IFaq } from '@/interface/faq-interface';
import FaqAccordion from '@/components/faq/faq-accordion';

export default function FaqPage() {
  const [activeMenu, setActiveMenu] = useState<string>('all'); // 현재 보고 있는 메뉴
  const [list, setList] = useState<IFaq[]>([]);
  const [value, setValue] = useState<string>('');

  // activeMenu값에 따라 데이터 세팅
  useEffect(() => {
    if (activeMenu === 'all') {
      // 모든 카테고리의 질문/답변 합치기
      const allFaqs = faqList.flatMap((faq) => faq.data);
      setList(allFaqs);
    } else {
      const selected = faqList.find((faq) => faq.category === activeMenu);
      setList(selected ? selected.data : []);
    }
  }, [activeMenu]);

  // 카테고리 명칭 변경
  const onChangeActiveMenu = (category: string) => {
    setActiveMenu(category);
    setValue('');
  };

  return (
    <div className="pb-40">
      <FaqMenuButton activeMenu={activeMenu} onChangeActiveMenu={onChangeActiveMenu} />
      <FaqAccordion list={list} value={value} onValueChange={(value: string) => setValue(value)} />
    </div>
  );
}
