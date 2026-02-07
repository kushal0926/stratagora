import Image from "next/image";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <Image
                src="/chessboardOne.png"
                width={500}
                height={500}
                alt="chess board logo"
            />

            <div className="bg-[#121212] rounded-md p-6 shadow-lg overflow-hidden max-w-2/4">
                <form className="space-y-5">
                    <div className="grid grid-col-3 gap-3">
                        <button
                            type="button"
                            className="relative group flex flex-col items-center justify-center p-4 rounded-lg border-none transition-all duration-200 bg-amber-400/10  ring-1 "
                        >
                            <div>
                                <Image
                                    src="/chess.webp"
                                    width={50}
                                    height={50}
                                    alt="chess logo"
                                />
                            </div>
                            <span>chess.com</span>
                            <input
                                id="chesscom"
                                className="hidden"
                                type="radio"
                                value="chesscom"
                                name="platform"
                            />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"></div>
                        </button>
                        <button
                            type="button"
                            className="relative group flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 bg-amber-400/10 border-amber-400 ring-1 ring-amber-400"
                        >
                            <div>
                                <Image
                                    src="/lichess.webp"
                                    width={50}
                                    height={50}
                                    alt="chess logo"
                                />
                            </div>
                        </button>
                        <button
                            type="button"
                            className="relative group flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 bg-amber-400/10 border-amber-400 ring-1 ring-amber-400"
                        >
                            <div>
                                <Image
                                    src="/chess.webp"
                                    width={50}
                                    height={50}
                                    alt="chess logo"
                                />
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default HeroSection;
