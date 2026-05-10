export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/20 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Traveloop. Personalized travel planning.</p>
        <p>Built with React, Tailwind, Redux Toolkit, and a local mock API.</p>
      </div>
    </footer>
  );
}
