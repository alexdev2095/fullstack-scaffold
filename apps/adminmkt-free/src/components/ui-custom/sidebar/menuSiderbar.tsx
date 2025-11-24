import {
  IoBagHandleOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoMegaphoneOutline,
  IoPeopleOutline,
  IoPricetagOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

export const menuSiderbar = [
  {
    href: "/",
    children: <IoGridOutline className="size-5" />,
    nav: ["/"],
  },

  {
    href: "/products/catalog",
    children: <IoBagHandleOutline className="size-5" />,
    nav: ["/products", "/products/catalog", "/products/warehouse"],
  },

  {
    href: "/warehouse",
    children: <IoStorefrontOutline className="size-5" />,
    nav: ["/warehouse"],
  },
];
