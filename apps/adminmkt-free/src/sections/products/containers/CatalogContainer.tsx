import TitleDashboard from "@/components/ui-custom/title/TitleDashboard";
import React from "react";
import { menuItems as menu } from "../components/menu/menuItem";
import NavTabsContainer from "@/components/ui-custom/nav-tabs/NavTabsContainer";

const CatalogContainer = () => {
  return (
    <div className="space-y-5">
      <TitleDashboard title="Catalogo" subTitle="Catalogo de sus productos." />
      <NavTabsContainer menuItems={menu} />
    </div>
  );
};

export default CatalogContainer;
