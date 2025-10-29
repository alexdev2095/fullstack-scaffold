import { UserNav } from "./user-nav";
import { ButtonToggleTheme } from "@/components/ui/button-toggle-theme";

export function HeaderContainer() {
  return (
    <header className="h-20 flex items-center px-5">
      <section className="ml-auto">
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
