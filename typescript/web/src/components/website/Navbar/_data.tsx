import * as React from "react";
import { DOCUMENTATION_URL } from "../../../constants";
// import { IoCalendar, IoGrid, IoHelpBuoy } from "react-icons/io5";
// import { MdWeb } from "react-icons/md";

export interface Link {
  label: string;
  href?: string;
  target?: "_blank";
  children?: Array<{
    label: string;
    description?: string;
    href: string;
    icon?: React.ReactElement;
    target?: "_blank";
  }>;
}

export const links: Link[] = [
  { label: "Product", href: "/website#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Open", href: "/open" },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: "/posts" },
      {
        label: "Documentation",
        href: DOCUMENTATION_URL,
        target: "_blank",
      },
      { label: "About", href: "/about" },
      {
        label: "Jobs",
        href: "https://labelflow.recruitee.com",
        target: "_blank",
      },
    ],
  },
];
