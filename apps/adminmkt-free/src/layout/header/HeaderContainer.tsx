import { Input } from "@/components/ui/input";
import { UserNav } from "./user-nav";
import { ButtonToggleTheme } from "@/components/ui/button-toggle-theme";

export function HeaderContainer() {
  return (
    <header className="h-20 flex items-center justify-end md:justify-between px-5">
      <section className="hidden md:block">
        <Input type="text" placeholder="Buscar..." className="h-10" />
      </section>
      <section>
        <ul className="flex items-center gap-2">
          <li>
            <ButtonToggleTheme />
          </li>
          <li>
            <UserNav />
          </li>
        </ul>
      </section>
    </header>
  );
}
