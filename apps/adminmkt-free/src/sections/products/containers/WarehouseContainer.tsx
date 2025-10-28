import TitleDashboard from "@/components/ui-custom/title/TitleDashboard";
import React from "react";
import { menuItems } from "../components/menu/menuItem";
import NavTabsContainer from "@/components/ui-custom/nav-tabs/NavTabsContainer";

const WarehouseContainer = () => {
  return (
    <div className="space-y-5">
      <TitleDashboard
        title="Almacenes"
        subTitle="Gestione y control de los almacenes existentes."
      />
      <NavTabsContainer
        menuItems={menuItems}
        href="/products/warehouse/new"
        titleButtom="Nuevo Almacén"
      />
    </div>
  );
};

export default WarehouseContainer;
