import Link from "next/link";

import { NavProducts } from "@/components/ui-custom/navs/nav-products";
import { Title } from "@/components/ui-custom/title";

import { IoAdd } from "react-icons/io5";

export default function ProductsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2">
          <Title>Productos</Title>
          <p className="text-muted-foreground text-sm">
            Gestione y controle sus productos y existencias.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <NavProducts />
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 bg-primary text-white h-10 px-3 rounded-full transition-all duration-300 hover:ring-2 hover:ring-primary ring-offset-2 ring-offset-background"
          >
            <IoAdd className="size-4" />
            <span>Nuevo producto</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
