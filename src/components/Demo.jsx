import { useEffect, useState } from "react";

import { copy, linkIcon, loader, tick, navToLink } from "../assets";

import { useLazyGetSummaryQuery } from "../services/article";
import {
  useDetectLanguageMutation,
  useTranslateTextMutation,
} from "../services/translate";

const Demo = () => {
  const [detectLanguage] = useDetectLanguageMutation();
  const [translateText] = useTranslateTextMutation();
  const [article, setArticle] = useState({
    url: "",
    summary: "",
    translatedSummary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState(null); // State handle errors
  const [isFetching, setIsFetching] = useState(false); // State handle loading

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const [getSummary] = useLazyGetSummaryQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsFetching(true);

    try {
      const { data, error } = await getSummary({ articleUrl: article.url });

      if (error) {
        setError(error.data.error);
        setIsFetching(false);
        return;
      }

      if (data?.summary) {
        const formattedSummary = data.summary.replace(/\n\n/g, "<br /><br />");
        const newArticle = { ...article, summary: formattedSummary };
        setArticle(newArticle);
        setIsFetching(false);
        handleTranslateSummary(newArticle.summary);
      }
    } catch (err) {
      console.error("Error al obtener el resumen:", err);
      setError("Ocurrió un error al procesar el resumen.");
      setIsFetching(false);
    }
  };

  const handleTranslateSummary = async (summary) => {
    try {
      const { data: detectData } = await detectLanguage(summary).unwrap();
      const detectedLang = detectData?.detections[0]?.language;

      if (detectedLang && detectedLang !== "es") {
        const { data: translateData } = await translateText({
          text: summary,
          sourceLang: detectedLang,
          targetLang: "es",
        }).unwrap();

        const translatedSummary = translateData?.translations?.translatedText;

        setArticle((prev) => {
          const updatedArticle = {
            ...prev,
            translatedSummary,
          };

          const updatedAllArticles = [updatedArticle, ...allArticles];
          setAllArticles(updatedAllArticles);
          localStorage.setItem("articles", JSON.stringify(updatedAllArticles));

          return updatedArticle;
        });
      }
    } catch (err) {
      console.error("Error al traducir el resumen:", err);
      setError("Error al traducir el resumen.");
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);

    setTimeout(() => {
      setCopied("");
    }, 2000);
  };

  const handleNavTo = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/*****Search*****/}

      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Introduce la URL"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
      </div>

      {/*****Browse URL History*****/}

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {allArticles.map((item, index) => (
          <div
            key={`link-${index}`}
            onClick={() => setArticle(item)}
            className="link_card mt-3"
          >
            <div
              className={copied === item.url ? `copy_btn_success` : `copy_btn`}
              onClick={() => handleCopy(item.url)}
            >
              <img
                src={copied === item.url ? tick : copy}
                alt="copy_icon"
                className="w-[40%] h-[40%] object-contain"
              />
            </div>
            <div
              className="nav-to-link_btn"
              onClick={() => handleNavTo(item.url)}
            >
              <img
                src={navToLink}
                alt="navToLink_icon"
                className="w-[40%] h-[40%] object-contain"
              />
            </div>
            <p className="flex-1 font-satoshi text-purple-700 font-medium text-sm truncate">
              {item.url}
            </p>
          </div>
        ))}
      </div>

      {/*****Display Result*****/}

      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Esto no debería pasar... <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                <span className="pink_gradient"> Resumen</span> del Articulo
              </h2>
              <div className="summary_box">
                <p
                  className="font-inter font-medium text-sm text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: article.translatedSummary || article.summary,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
