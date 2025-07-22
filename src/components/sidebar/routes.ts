import { User, UserPlus, List, Home, Users, BadgeCheck } from "lucide-react";

export const ROUTES = {
  navMain: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
        },
      ],
    },
    {
      title: "Soldadores",
      url: "#",
      items: [
        {
          title: "Soldadores",
          url: "/welders",
          icon: User,
        },
        {
          title: "Crear soldador",
          url: "/welders/create",
          icon: UserPlus,
        },
        {
          title: "Lista Espera",
          url: "/welders/waiting-list",
          icon: List,
        },
      ],
    },
    {
      title: "Empresa",
      url: "#",
      items: [
        {
          title: "Grupos",
          url: "/groups",
          icon: Users,
        },
        {
          title: "Certificaciones",
          url: "/certifications",
          icon: BadgeCheck,
        },
      ],
    },
  ],
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://github.com/shadcn.png",
  },
};
