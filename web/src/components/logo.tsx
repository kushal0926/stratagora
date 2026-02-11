import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <h1 className="text-5xl logo text-cream">stratagora</h1>  
      <Image src="/chess.png" alt="stratagora logo" width={72} height={22} />
    </Link>
  );
}
