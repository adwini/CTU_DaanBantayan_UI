export default function OverviewCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="rounded-lg bg-primary/10 text-primary p-4 font-semibold shadow hover:-translate-y-1 transition">
        <i className="bi bi-people mr-2" /> Total Students: 1200
      </div>
      {/* Repeat for other cards */}
    </section>
  );
}
