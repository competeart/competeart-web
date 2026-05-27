interface FundoFestivalProps {
  variante?: "padrao" | "admin";
}

export default function FundoFestival({ variante = "padrao" }: FundoFestivalProps) {
  const admin = variante === "admin";

  return (
    <>
      <div className="absolute inset-0 bg-[#060606]" />
      <div className="absolute inset-0 bg-grade-sutil opacity-40" />
      <div
        className={`absolute inset-0 ${
          admin
            ? "bg-[radial-gradient(circle_at_18%_18%,rgba(249,115,22,0.16),transparent_42%),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.10),transparent_40%),radial-gradient(circle_at_55%_85%,rgba(244,114,182,0.10),transparent_45%)]"
            : "bg-[radial-gradient(circle_at_20%_25%,rgba(249,115,22,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.14),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(34,211,238,0.10),transparent_45%)]"
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.52)_55%,rgba(0,0,0,0.72)_100%)]" />
      <div className="pointer-events-none absolute bottom-[-4rem] left-[-4rem] h-52 w-52 rounded-full bg-cyan-400/7 blur-3xl brilho-lento" />
    </>
  );
}
