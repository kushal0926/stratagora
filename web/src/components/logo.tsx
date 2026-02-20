import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <h1 className="logo text-cream hover:text-chess text-3xl sm:text-5xl ">stratagora</h1>
      <Image src="/chess.png" alt="stratagora logo" width={72} height={22}/>
    </Link>
  );
}
