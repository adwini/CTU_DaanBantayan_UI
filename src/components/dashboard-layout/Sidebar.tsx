import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-muted text-muted-foreground z-50 overflow-y-auto pt-6 px-4">
      <nav className="space-y-2 text-sm font-medium">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded hover:bg-muted/40">
          <i className="bi bi-bar-chart mr-2" /> Dashboard
        </Link>
        <Link
          href="/dashboard/admin/user-management"
          className="block px-4 py-2 rounded hover:bg-muted/40">
          <i className="bi bi-people mr-2" /> Manage Users
        </Link>
        {/* Add other links as needed */}
      </nav>
    </aside>
  );
}
