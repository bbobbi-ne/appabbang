import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "flex justify-center items-center rounded-none transition-colors",
  {
    variants: {
      variant: {
        fill: "",
        line: "border",
      },
      color: {
        base: "",
        red: "",
        blue: "",
        white: "",
        ghost: "",
        lightGray: "",
      },
      size: {
        small: "p-2 text-xs",
        medium: "p-3 text-sm",
        large: "p-5 text-base",
      },
      disabled: {
        true: "",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      // fill 스타일
      {
        variant: "fill",
        color: "base",
        disabled: false,
        class: "bg-slate-700 text-white hover:bg-slate-900",
      },
      {
        variant: "fill",
        color: "base",
        disabled: true,
        class: "bg-slate-200 text-slate-500",
      },
      {
        variant: "fill",
        color: "red",
        disabled: false,
        class: "bg-red-500 text-white hover:bg-red-700",
      },
      {
        variant: "fill",
        color: "red",
        disabled: true,
        class: "bg-red-300 text-white",
      },
      {
        variant: "fill",
        color: "blue",
        disabled: false,
        class: "bg-blue-600 text-white hover:bg-blue-800",
      },
      // figma 에서는 fill bule disabled 없음 (250313)
      // {
      //   variant: "fill",
      //   color: "blue",
      //   disabled: true,
      //   class: "bg-blue-300 text-white",
      // },
      {
        variant: "fill",
        color: "ghost",
        disabled: false,
        class: "bg-white text-slate-700 hover:bg-slate-100",
      },
      {
        variant: "fill",
        color: "lightGray",
        disabled: false,
        class: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      },
      // line 스타일
      {
        variant: "line",
        color: "red",
        disabled: false,
        class: "bg-red-100 text-red-700 border-red-500 hover:bg-red-200",
      },
      // figma 에서는 line red disabled 없음 (250313)
      // {
      //   variant: "line",
      //   color: "red",
      //   disabled: true,
      //   class: "bg-red-100 text-red-700 border-red-500",
      // },
      {
        variant: "line",
        color: "blue",
        disabled: false,
        class:
          "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-200 hover:text-blue-900",
      },
      // figma 에서는 line bule disabled 없음 (250313)
      // {
      //   variant: "line",
      //   color: "blue",
      //   disabled: true,
      //   class: "bg-blue-100 text-blue-700 border-blue-300",
      // },
      {
        variant: "line",
        color: "white",
        disabled: false,
        class:
          "bg-white text-slate-700 border-slate-300 border-slate-300 hover:bg-slate-100",
      },
    ],
    defaultVariants: {
      variant: "fill",
      color: "blue",
      size: "medium",
      disabled: false,
    },
  },
);
