import {
  IoBagHandleOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoHelp,
  IoMegaphoneOutline,
  IoPaperPlane,
  IoPeopleOutline,
  IoPricetagOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export const menuSiderbar = [
  {
    href: "/",
    children: <IoGridOutline className="size-5" />,
    nav: ["/"],
  },
  {
    href: "/leads-management",
    children: <IoPeopleOutline className="size-5" />,
    nav: ["/leads-management"],
  },
  {
    href: "/products/catalog",
    children: <IoBagHandleOutline className="size-5" />,
    nav: ["/products", "/products/catalog", "/products/warehouse"],
  },
  {
    href: "/transactions",
    children: <IoDocumentTextOutline className="size-5" />,
    nav: ["/transactions"],
  },
  {
    href: "/campaigns-management",
    children: <IoMegaphoneOutline className="size-5" />,
    nav: ["/campaigns-management"],
  },
  {
    href: "/pricing",
    children: <IoPricetagOutline className="size-5" />,
    nav: ["/pricing"],
  },
];

export const menuConfig = [
  {
    href: "/prueba1",
    children: <IoSettingsOutline className="size-5" />,
    nav: ["/prueba1"],
  },
  {
    href: "/prueba2",
    children: <IoHelp className="size-5" />,
    nav: ["/prueba2"],
  },
  {
    href: "/prueba",
    children: <IoPaperPlane className="size-5" />,
    nav: ["/prueba"],
  },
];
