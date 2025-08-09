/**
 * 자주묻는질문
 */

import { useEffect, useState } from 'react';
import FaqMenuButton from '../faq/faq-menu-button';
import { faqList } from '../faq/faq-data';
import type { IFaq } from '@/interface/faq-interface';
import FaqAccordion from '../faq/faq-accordion';

export default function FaqPage() {
  const [activeMenu, setActiveMenu] = useState<string>('all'); // 현재 보고 있는 메뉴
  const [list, setList] = useState<IFaq[]>([]);

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
  const onChangeActiveMenu = (category: string) => setActiveMenu(category);

  return (
    <div className="flex flex-col mb-30">
      <FaqMenuButton activeMenu={activeMenu} onChangeActiveMenu={onChangeActiveMenu} />
      <FaqAccordion list={list} />
    </div>
  );
}
