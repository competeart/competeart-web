import { Instagram, Mail } from "lucide-react";

const PERFIL_INSTAGRAM = "https://www.instagram.com/competeartfestival/";
const EMAIL_CONTATO = "competeartfestival@gmail.com";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-black px-5 py-10 text-white/45 sm:px-8 sm:py-12 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
        <p className="text-xs font-medium tracking-[0.08em] text-white/60">
          Compete&apos;Art <span className="ml-1 text-white/35">© 2026</span>
        </p>

        <nav
          aria-label="Contato e redes sociais"
          className="flex flex-col items-center gap-3 text-[0.68rem] sm:flex-row sm:gap-5"
        >
          <a
            href={PERFIL_INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-white/80"
          >
            <Instagram aria-hidden="true" size={15} strokeWidth={1.7} />
            Instagram
          </a>
          <a
            href={`mailto:${EMAIL_CONTATO}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white/80"
          >
            <Mail aria-hidden="true" size={15} strokeWidth={1.7} />
            {EMAIL_CONTATO}
          </a>
        </nav>
      </div>
    </footer>
  );
}
