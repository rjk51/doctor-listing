'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './FilterPanel.module.css';

const FilterPanel = ({ doctors, updateFilters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get unique specialties from all doctors
  const allSpecialties = [...new Set(
    doctors.flatMap(doctor => 
      doctor.specialities.map(spec => spec.name)
    )
  )].sort();

  // Initialize state from URL params
  const [consultationType, setConsultationType] = useState(
    searchParams.get('consultationType') || ''
  );
  
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    searchParams.get('specialties') 
      ? searchParams.get('specialties').split(',') 
      : []
  );
  
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || ''
  );

  // State for expandable sections
  const [isConsultationExpanded, setIsConsultationExpanded] = useState(true);
  const [isSpecialtiesExpanded, setIsSpecialtiesExpanded] = useState(true);

  // Add state for specialty search
  const [specialtySearch, setSpecialtySearch] = useState('');
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (consultationType) {
      params.set('consultationType', consultationType);
    }
    if (selectedSpecialties.length > 0) {
      params.set('specialties', selectedSpecialties.join(','));
    }
    if (sortBy) {
      params.set('sortBy', sortBy);
    }
    // Only update URL if needed to prevent infinite loops
    const currentQuery = new URLSearchParams(window.location.search).toString();
    const newQuery = params.toString();
    if (currentQuery !== newQuery) {
      router.push(`${pathname}?${newQuery}`);
    }
    updateFilters({
      consultationType,
      specialties: selectedSpecialties,
      sortBy
    });
  }, [consultationType, selectedSpecialties, sortBy, pathname, router, updateFilters]);

  const handleConsultationChange = (type) => {
    setConsultationType(type === consultationType ? '' : type);
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleSortChange = (sort) => {
    setSortBy(sort === sortBy ? '' : sort);
  };

  const clearAllFilters = () => {
    setConsultationType('');
    setSelectedSpecialties([]);
  };

  const toggleConsultationExpanded = () => {
    setIsConsultationExpanded(!isConsultationExpanded);
  };

  const toggleSpecialtiesExpanded = () => {
    setIsSpecialtiesExpanded(!isSpecialtiesExpanded);
  };

  // Filter specialties based on search
  const filteredSpecialties = allSpecialties.filter(specialty => 
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  return (
    <div className={styles.filterPanelContainer}>
      {/* Sort By Container*/}
      <div className={styles.sortPanel}>
        <div className={styles.filterHeader}>
          <h2>Sort By</h2>
        </div>
        <div className={styles.filterOptions}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              checked={sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              data-testid="sort-fees"
            />
            <span>Fees (Low to High)</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              checked={sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              data-testid="sort-experience"
            />
            <span>Experience (High to Low)</span>
          </label>
        </div>
      </div>

      {/* Filters Container */}
      <div className={styles.filterPanel}>
        <div className={styles.filterHeader}>
          <h2>Filters</h2>
          {(consultationType || selectedSpecialties.length > 0) && (
            <button
              className={styles.clearAllButton}
              onClick={clearAllFilters}
              data-testid="clear-all-filters"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Consultation Type Filter - Expandable */}
        <div className={styles.filterSection}>
          <div
            className={styles.sectionHeader}
            onClick={toggleConsultationExpanded}
            data-testid="filter-header-moc"
          >
            <h3>Mode of Consultation</h3>
            <span className={`${styles.expandIcon} ${isConsultationExpanded ? styles.expanded : ''}`}>
              {isConsultationExpanded ? '−' : '+'}
            </span>
          </div>
          {isConsultationExpanded && (
            <div className={styles.filterOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  checked={consultationType === ''}
                  onChange={() => setConsultationType('')}
                  data-testid="filter-all-consult"
                />
                <span>All</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  checked={consultationType === 'video_consult'}
                  onChange={() => handleConsultationChange('video_consult')}
                  data-testid="filter-video-consult"
                />
                <span>Video Consultation</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  checked={consultationType === 'in_clinic'}
                  onChange={() => handleConsultationChange('in_clinic')}
                  data-testid="filter-in-clinic"
                />
                <span>In Clinic</span>
              </label>
            </div>
          )}
        </div>

        {/* Specialties Filter - Expandable */}
        <div className={styles.filterSection}>
          <div
            className={styles.sectionHeader}
            onClick={toggleSpecialtiesExpanded}
            data-testid="filter-header-speciality"
          >
            <h3>Specialities</h3>
            <span className={`${styles.expandIcon} ${isSpecialtiesExpanded ? styles.expanded : ''}`}>
              {isSpecialtiesExpanded ? '−' : '+'}
            </span>
          </div>
          {isSpecialtiesExpanded && (
            <div className={styles.filterOptions}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search specialties..."
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                  className={styles.specialtySearch}
                  data-testid="specialty-search"
                />
              </div>
              {filteredSpecialties.map(specialty => (
                <label key={specialty} className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    data-testid={`filter-specialty-${specialty.replace(/\s+/g, '-').replace(/\//g, '-')}`}
                  />
                  <span>{specialty}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;