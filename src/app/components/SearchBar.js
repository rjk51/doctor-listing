'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';

const SearchBar = ({ doctors, updateSearchQuery }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Initialize search term from URL params
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filteredDoctors = doctors
      .filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 3); // Limit to top 3 matches

    setSuggestions(filteredDoctors);
  }, [searchTerm, doctors]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    updateSearchQuery(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSearchQuery(searchTerm);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchContainer} ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search Symptoms, Doctors, Specialists, Clinics"
            className={styles.searchInput}
            data-testid="autocomplete-input"
          />
          <button type="submit" className={styles.searchButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((doctor, index) => (
            <li 
              key={doctor.id} 
              onClick={() => handleSuggestionClick(doctor.name)}
              data-testid="suggestion-item"
              className={styles.suggestionItem}
            >
              <div className={styles.doctorInfo}>
                <div className={styles.doctorAvatar}>
                  {doctor.photo ? (
                    <img src={doctor.photo} alt={doctor.name} className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatarInitials}>{doctor.name.charAt(0)}</div>
                  )}
                </div>
                <div className={styles.doctorDetails}>
                  <div className={styles.doctorName}>{doctor.name}</div>
                  <div className={styles.doctorSpecialty}>
                    {doctor.specialities && doctor.specialities.length > 0 
                      ? doctor.specialities[0].name 
                      : 'DENTIST'}
                  </div>
                </div>
              </div>
              <div className={styles.arrowIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;