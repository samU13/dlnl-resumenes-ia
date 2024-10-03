import { useEffect, useState } from "react";

import { useLazyGetSummaryQuery } from "../services/article";
import {
  useDetectLanguageMutation,
  useTranslateTextMutation,
} from "../services/translate";

import BrowseURLHistory from "./BrowseURLHistory";
import DisplayResult from "./DisplayResult";
import Search from "./Search";

const Main = () => {
  const [detectLanguage] = useDetectLanguageMutation();
  const [translateText] = useTranslateTextMutation();
  const [article, setArticle] = useState({
    url: "",
    summary: "",
    translatedSummary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
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

    setArticle((prev) => ({ ...prev, summary: "", translatedSummary: "" })); // Reset article state

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

          const updatedAllArticles = [...allArticles, updatedArticle];
          setAllArticles(updatedAllArticles);
          localStorage.setItem("articles", JSON.stringify(updatedAllArticles));

          setIsFetching(false);

          return updatedArticle;
        });
      }
    } catch (err) {
      console.error("Error al traducir el resumen:", err);
      setError("Error al traducir el resumen.");
    }
  };

  const handleArticle = (item) => {
    setArticle(item);
  };

  const handleNavTo = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/*****Search*****/}
      <Search {...{ article, setArticle, handleSubmit }} />

      {/*****Browse URL History*****/}

      <BrowseURLHistory {...{ allArticles, handleNavTo, handleArticle }} />

      {/*****Display Result*****/}

      <DisplayResult {...{ isFetching, error, article }} />
    </section>
  );
};

export default Main;
