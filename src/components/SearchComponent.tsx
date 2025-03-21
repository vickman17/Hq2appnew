import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./SearchComponent.module.css";
import searchIcon from "/assets/svg/search.svg";
import { Category } from "../types";


interface SearchComponentProps {
    onCategorySelect: (category: Category) => void;
  }  

const SearchComponent: React.FC<SearchComponentProps> = ({ onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCategoryClick = (category: Category) => {
    onCategorySelect(category);  // Pass the selected category to Dashboard
};

  // Fetch categories once when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/hq2ClientApi/searchCategory.php"); 
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFocus = () => setIsSearchActive(true);
  const handleBlur = () => {
    setTimeout(() => setIsSearchActive(false), 200);
  };

  // **Debounce Function (Fixes Typing Lag)**
  useEffect(() => { 
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const query = searchTerm.toLowerCase().trim();

      // Filter categories & subcategories
      const filteredResults = categories.flatMap(category => {
        const matches: string[] = [];

        if (category.name.toLowerCase().includes(query)) {
          matches.push(`${category.name}`);
        }

        category.subcategories.forEach(sub => {
          if (sub.toLowerCase().includes(query)) {
            matches.push(`${sub}`);
          }
        });

        return matches;
      });

      setSearchSuggestions(filteredResults.length > 0 ? filteredResults : ["No results found"]);
      setLoading(false);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delaySearch);
  }, [searchTerm, categories]);

  return (
    <div className={styles.searchContainer} style={{border: "0px solid black", background: "transparent"}}>
      {isSearchActive && <div className={styles.overlay}></div>}
      <div className={styles.searchBox}>
      <div style={{border: "0px solid black"}} className={styles.searchCont}>
        <div style={{ paddingLeft: "6px", alignItems: "baseline" }}>
          <img src={searchIcon} width={20} alt="Search" />
        </div>

        <input
          ref={inputRef}
          placeholder="Search services"
          className={styles.search}
          style={{ border: "0px solid black" }}
          type="text"
          value={searchTerm}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isSearchActive && (
          <div className={styles.suggestions} style={{border: "0px solid black", width: "100%", height: "100vh", overflow: "scroll", boxShadow:"none"}}>
            {loading ? (
              <div className={styles.suggestionItem}>🔄 Searching...</div>
            ) : (
              searchSuggestions.map((suggestion, index) => (
                <div key={index} style={{fontWeight: "600", fontSize: "18px"}} className={styles.suggestionItem}>
                  {suggestion}
                </div>
              ))
            )}
          </div>
                  )}
      
      </div>
      </div>
    </div>
  );
};

export default SearchComponent;
