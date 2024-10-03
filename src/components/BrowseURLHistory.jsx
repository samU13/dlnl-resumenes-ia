import { useState } from "react";
import { copy, tick, navToLink } from "../assets";
import PropTypes from "prop-types";

const BrowseURLHistory = ({ allArticles, handleNavTo, handleArticle }) => {
  const [copied, setCopied] = useState("");

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => {
      setCopied("");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
      {allArticles.map((item, index) => (
        <div
          key={`link-${index}`}
          onClick={() => handleArticle(item)}
          className="link_card mt-3"
        >
          <div
            className={copied === item.url ? "copy_btn_success" : "copy_btn"}
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
  );
};

BrowseURLHistory.propTypes = {
  allArticles: PropTypes.array,
  handleNavTo: PropTypes.func,
  handleArticle: PropTypes.func,
};

export default BrowseURLHistory;
