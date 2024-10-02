const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <div className="w-38 object-contain font-bold text-4xl line-through decoration-purple-500">
          DL<span className="text-pink-500">NL</span>{" "}
        </div>
        <button
          type="button"
          onClick={() => window.open("https://github.com/samU13")}
          className="black_btn"
        >
          GitHub
        </button>
      </nav>
      <h1 className="head_text">
        Resumen Articulos con <br />
        <span className="purple_gradient">OpenAI GPT-4o</span>
      </h1>
      <h2 className="desc">
        Simplifique su lectura con DLNL (
        <span className="text-purple-500">Demasiado Largo, No Leo</span>), un
        resumidor de artículos de código abierto que transforma artículos
        extensos en resúmenes claros y concisos,{" "}
        <span className="text-pink-500">
          traducido al castellano de cualquier idioma.
        </span>
      </h2>
    </header>
  );
};

export default Hero;
