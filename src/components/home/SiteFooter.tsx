import { Instagram, Mail } from "lucide-react";
import { PROXIMA_EDICAO } from "../../data/evento";

const PERFIL_INSTAGRAM = "https://www.instagram.com/competeartfestival/";
const EMAIL_CONTATO = "competeartfestival@gmail.com";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-black px-5 py-10 text-white/45 sm:px-8 sm:py-12 md:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-8 text-center md:grid-cols-[0.75fr_1.5fr_1fr] md:text-left">
        <p className="text-xs font-medium tracking-[0.08em] text-white/60">
          Compete&apos;Art <span className="ml-1 text-white/35">© 2026</span>
        </p>

        <div className="text-[0.68rem] leading-relaxed tracking-[0.04em] md:text-center">
          <time dateTime="2027-06-05" className="text-white/60">
            {PROXIMA_EDICAO.dataCompleta}
          </time>
          <span className="mt-1 block">
            {PROXIMA_EDICAO.local} · {PROXIMA_EDICAO.cidade}
          </span>
        </div>

        <nav
          aria-label="Contato e redes sociais"
          className="flex flex-col items-center gap-3 text-[0.68rem] sm:flex-row sm:justify-center sm:gap-5 md:justify-end"
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
