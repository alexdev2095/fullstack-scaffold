import TitleDashboard from "@/components/ui-custom/title/TitleDashboard";
import React from "react";
import { menuItems } from "../components/menu/menuItem";
import NavTabsContainer from "@/components/ui-custom/nav-tabs/NavTabsContainer";

const ProductsContainer = () => {
  return (
    <div className="space-y-5">
      <TitleDashboard
        title="Productos"
        subTitle="Gestione y controle sus productos y existencias."
      />
      <NavTabsContainer
        menuItems={menuItems}
        titleButtom="Nuevo Producto"
        href="/products/new"
      />
    </div>
  );
};

export default ProductsContainer;
