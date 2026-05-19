import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { PRODUCTS } from '../../constants';
import { useDebounce } from '../../hooks/useDebounce';
import { getSearchSuggestions } from '../../utils/searchProducts';
import SearchSuggestionDropdown from './SearchSuggestionDropdown';

interface SearchBarProps {
  initialValue?: string;
  className?: string;
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialValue = '',
  className = '',
  placeholder = 'Tìm kiếm sản phẩm...',
  onSearch,
  autoFocus = false,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search value to avoid filtering on every keystroke
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Get suggestions based on debounced value
  const suggestions = getSearchSuggestions(PRODUCTS, debouncedSearchValue, 6);

  // Show dropdown when there's input and dropdown should be visible
  const shouldShowDropdown = isFocused && searchValue.trim().length > 0;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Handle form submission (Enter key)
  const handleSubmit = useCallback(() => {
    const keyword = searchValue.trim();
    if (keyword) {
      // Close dropdown
      setIsDropdownVisible(false);
      setIsFocused(false);

      // Navigate to search results or call onSearch callback
      if (onSearch) {
        onSearch(keyword);
      } else {
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
      }
    }
  }, [searchValue, onSearch, navigate]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsDropdownVisible(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (product: Product) => {
    // No product detail page in mock mode - just fill search and close dropdown
    setIsDropdownVisible(false);
    setIsFocused(false);
    setSearchValue(product.name);
  };

  // Handle "View All" button
  const handleViewAll = (keyword: string) => {
    setIsDropdownVisible(false);
    setIsFocused(false);
    if (onSearch) {
      onSearch(keyword);
    } else {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  // Clear search input
  const handleClear = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        setIsFocused(false);
      }
    };

    if (shouldShowDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [shouldShowDropdown]);

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Sync with initial value
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <motion.div
        className={`relative flex items-center bg-white border-2 rounded-xl overflow-hidden transition-all ${
          isFocused
            ? 'border-brand-primary shadow-lg shadow-brand-primary/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Search Icon */}
        <div className="pl-4 pr-2 flex items-center justify-center">
          <Search
            size={20}
            className={`transition-colors ${isFocused ? 'text-brand-primary' : 'text-slate-400'}`}
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setIsDropdownVisible(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 h-12 bg-transparent border-none outline-none text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
          aria-label="Search products"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            onClick={handleClear}
            className="px-3 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X size={18} className="text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </motion.div>

      {/* Dropdown */}
      <SearchSuggestionDropdown
        suggestions={suggestions}
        isVisible={shouldShowDropdown}
        onSelect={handleSuggestionSelect}
        onViewAll={handleViewAll}
        onSearch={(keyword) => {
          setSearchValue(keyword);
          handleViewAll(keyword);
        }}
        searchKeyword={searchValue}
      />
    </div>
  );
}
