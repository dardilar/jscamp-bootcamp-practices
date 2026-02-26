import { useState, useRef } from "react";

export const useSearchForm = function({ idTechnology, idLocation, idExperienceLevel, idText, onSearch, onTextFilter }) {
  const timeoutId = useRef(null);
  
  const [searchText, setSearchText] = useState("");

  const handleSubmit = function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget)

    if(e.target.name === idText) {
      return;
    }
  
    const filters = {
      technology: formData.get(idTechnology),
      location: formData.get(idLocation),
      experienceLevel: formData.get(idExperienceLevel),
    }
  
    onSearch(filters);
  }
  
  const handleTextChange = function(e) {
    const text = e.target.value;
    setSearchText(text); // Update input immediately

    // Debounce: Cancel previous timeout
    if(timeoutId.current) clearTimeout(timeoutId.current);
    
    timeoutId.current = setTimeout(() => {
      onTextFilter(text);
    }, 500);
  }

  return {
    handleSubmit,
    handleTextChange,
  }
}