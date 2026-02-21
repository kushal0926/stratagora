import Image from "next/image";

export default function Title() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-4 py-2 transition-all duration-200 ease-out hover:scale-[1.01]">
      <h1 className="logo text-cream hover:text-chess text-3xl sm:text-5xl">
        chAiZe
      </h1>
      <Image src="/chess.png" alt="stratagora logo" width={72} height={22} />
    </div>
  );
}
