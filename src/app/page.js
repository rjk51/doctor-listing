'use client';
import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useSearchParams } from 'next/navigation';
import { fetchDoctors } from './utils/api';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import DoctorCard from './components/DoctorCard';
import styles from './page.module.css';

export default function Home() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  
  const [activeFilters, setActiveFilters] = useState({
    consultationType: searchParams.get('consultationType') || '',
    specialties: searchParams.get('specialties') 
      ? searchParams.get('specialties').split(',') 
      : [],
    sortBy: searchParams.get('sortBy') || ''
  });

  // Fetch doctors data
  useEffect(() => {
    const getDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDoctors();
        setDoctors(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch doctor data. Please try again later.');
        setIsLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (!doctors.length) return;

    let result = [...doctors];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply consultation type filter
    if (activeFilters.consultationType) {
      result = result.filter(doctor => 
        doctor[activeFilters.consultationType] === true
      );
    }

    // Apply specialties filter
    if (activeFilters.specialties.length > 0) {
      result = result.filter(doctor => 
        doctor.specialities.some(spec => 
          activeFilters.specialties.includes(spec.name)
        )
      );
    }

    // Apply sorting
    if (activeFilters.sortBy) {
      if (activeFilters.sortBy === 'fees') {
        // Sort by fees (ascending)
        result.sort((a, b) => {
          const feeA = parseInt(a.fees.replace(/[^\d]/g, '') || '0');
          const feeB = parseInt(b.fees.replace(/[^\d]/g, '') || '0');
          return feeA - feeB;
        });
      } else if (activeFilters.sortBy === 'experience') {
        // Sort by experience (descending)
        result.sort((a, b) => {
          const expA = parseInt(a.experience?.match(/\d+/)?.[0] || '0');
          const expB = parseInt(b.experience?.match(/\d+/)?.[0] || '0');
          return expB - expA;
        });
      }
    }

    setFilteredDoctors(result);
  }, [doctors, searchQuery, activeFilters]);

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const updateFilters = useCallback((filters) => {
    setActiveFilters(filters);
  }, []); // Empty dependency array means this function is created once

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <SearchBar 
          doctors={doctors} 
          updateSearchQuery={updateSearchQuery} 
        />
      </header>
      
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <FilterPanel 
            doctors={doctors} 
            updateFilters={updateFilters} // Pass the memoized function
          />
        </aside>
        
        <section className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Loading doctors...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : filteredDoctors.length === 0 ? (
            <div className={styles.noResults}>No doctors found matching your criteria.</div>
          ) : (
            <div className={styles.doctorList}>
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}