export interface IFacMenuButtonProps {
  activeMenu: string;
  onChangeActiveMenu: (category: string) => void;
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface IFaqAccordionProps {
  list: IFaq[];
}
