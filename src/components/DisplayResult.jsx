import { loader } from "../assets";
import PropTypes from "prop-types";

const DisplayResult = ({ isFetching, error, article }) => {
  return (
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
                  __html: article.translatedSummary,
                }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

DisplayResult.propTypes = {
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  article: PropTypes.object,
};

export default DisplayResult;
