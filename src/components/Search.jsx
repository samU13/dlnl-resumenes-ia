import { linkIcon, deleteUrl } from "../assets";
import PropTypes from "prop-types";

const Search = ({ article, setArticle, handleSubmit }) => {
  return (
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
        {article.url && (
          <div
            className="delete-url_btn"
            onClick={() => {
              setArticle({ ...article, url: "" });
            }}
          >
            <img
              src={deleteUrl}
              alt="delete_icon"
              className="w-[40%] h-[40%] object-contain"
            />
          </div>
        )}
        <button
          type="submit"
          className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
        >
          ↵
        </button>
      </form>
    </div>
  );
};

Search.propTypes = {
  article: PropTypes.object,
  setArticle: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default Search;
