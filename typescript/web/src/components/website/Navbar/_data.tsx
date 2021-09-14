import * as React from "react";
// import { IoCalendar, IoGrid, IoHelpBuoy } from "react-icons/io5";
// import { MdWeb } from "react-icons/md";

export interface Link {
  label: string;
  href?: string;
  children?: Array<{
    label: string;
    description?: string;
    href: string;
    icon?: React.ReactElement;
  }>;
}

export const links: Link[] = [
  { label: "Product", href: "/website" },
  // { label: "For Labelling workers", href: "#" },
  // {
  //   label: "Resources",
  //   children: [
  //     {
  //       label: "Get Help",
  //       description: "Read our documentation and FAQs, or get in touch.",
  //       href: "#",
  //       icon: <IoHelpBuoy />,
  //     },
  //     {
  //       label: "Events & Meetups",
  //       description: "Discover and join your local Sketch community.",
  //       href: "#",
  //       icon: <IoCalendar />,
  //     },
  //     {
  //       label: "Extensions",
  //       description: "Do even more with Assistants, plugins and integrations.",
  //       href: "#",
  //       icon: <IoGrid />,
  //     },
  //     {
  //       label: "Blog",
  //       description: "Get updates, articles and insights from the team.",
  //       href: "#",
  //       icon: <MdWeb />,
  //     },
  //   ],
  // },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/posts" },
  { label: "Documentation", href: "https://labelflow.gitbook.io/labelflow/" },
];
