import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Bolt,
  Briefcase,
  Fingerprint,
  GanttChart,
  HomeIcon,
  LinkIcon,
  Nfc,
  Plus,
} from "lucide-react";

type NavigationItem = {
  name: string;
  link: string;
  icon?: JSX.Element;
};

const navigation: NavigationItem[] = [
  {
    name: "Home",
    link: "",
    icon: <HomeIcon size={20} className="" />,
  },
  {
    name: "Links",
    link: "link",
    icon: <LinkIcon size={20} className="" />,
  },
  {
    name: "Create",
    link: "create",
    icon: <Plus size={20} className="" />,
  },
  {
    name: "Works",
    link: "work",
    icon: <Briefcase size={20} className="" />,
  },
  {
    name: "contact",
    link: "contact",
    icon: <Nfc size={20} className="" />,
  },
  {
    name: "settings",
    link: "settings",
    icon: <Bolt size={20} className="" />,
  },
  {
    name: "bio",
    link: "bio",
    icon: <Fingerprint size={20} className="" />,
  },
  {
    name: "analytics",
    link: "analytics",
    icon: <GanttChart size={20} className="" />,
  },
];

export default navigation;
