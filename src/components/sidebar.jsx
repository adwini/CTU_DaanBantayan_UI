"use client";
import { useEffect } from "react";

export default function Sidebar() {
  useEffect(() => {
    // Optional: auto-close drawer on route change or escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        document
          .getElementById("scoped-sidebar")
          ?.classList.remove("overlay-open");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="btn btn-text max-sm:btn-square sm:hidden"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="scoped-sidebar"
        data-overlay="#scoped-sidebar"
        data-overlay-options='{
          "backdropExtraClasses": "!absolute",
          "backdropParent": "#custom-backdrop-container"
        }'>
        <span className="icon-[tabler--menu-2] size-5" />
      </button>

      {/* Sidebar Drawer */}
      <aside
        id="scoped-sidebar"
        className="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 absolute z-10 sm:flex sm:translate-x-0 [--body-scroll:true]"
        role="dialog"
        tabIndex={-1}>
        <div className="drawer-body px-2 pt-4">
          <ul className="menu p-0 space-y-1 text-sm font-medium">
            {[
              { label: "Home", icon: "home" },
              { label: "Account", icon: "user" },
              { label: "Notifications", icon: "message" },
              { label: "Email", icon: "mail" },
              { label: "Calendar", icon: "calendar" },
              { label: "Product", icon: "shopping-bag" },
              { label: "Sign In", icon: "login" },
              { label: "Sign Out", icon: "logout-2" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/40 transition">
                  <span className={`icon-[tabler--${item.icon}] size-5`} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Backdrop Container */}
      <div id="custom-backdrop-container" />
    </>
  );
}
