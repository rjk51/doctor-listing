import Image from 'next/image';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor }) => {
  // Extract years from experience string (e.g., "10 Years of experience" -> 10)
  const experienceYears = doctor.experience ? 
    parseInt(doctor.experience.match(/\d+/)?.[0] || '0') : 0;
  
  // Extract fee amount (e.g., "₹ 500" -> 500)
  const feeAmount = doctor.fees ? 
    parseInt(doctor.fees.replace(/[^\d]/g, '') || '0') : 0;

  // Clean and validate photo URL
  const photoUrl = doctor.photo ? doctor.photo.trim() : '';
  const isValidPhotoUrl = photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'));

  // Use isValidPhotoUrl in your component's JSX
  // Removed the duplicate image rendering logic here as it's already inside the return statement

  return (
    <div className={styles.card} data-testid="doctor-card">
      <div className={styles.cardContent}> {/* New wrapper for top section */}
        <div className={styles.leftSection}> {/* Wrapper for avatar and main info */}
          <div className={styles.avatar}>
            {isValidPhotoUrl ? (
              <Image
                src={photoUrl}
                alt={doctor.name}
                width={80}
                height={80}
                className={styles.avatarImg}
                onError={(e) => { e.target.style.display = 'none'; /* Hide image on error */ }}
              />
            ) : (
              <div className={styles.avatarInitials}>{doctor.name_initials || 'NA'}</div>
            )}
             {/* Fallback if image fails to load or no initials */}
            {!isValidPhotoUrl && !doctor.name_initials && (
              <div className={styles.avatarInitials}>??</div>
            )}
            {/* Display initials if image fails */}
             {isValidPhotoUrl && (
                <div className={styles.avatarInitialsOnError} style={{ display: 'none' }}>
                  {doctor.name_initials || 'NA'}
                </div>
             )}
          </div>
          <div className={styles.doctorInfo}>
            <h3 data-testid="doctor-name">{doctor.name}</h3>
            <div className={styles.specialty} data-testid="doctor-specialty">
              {doctor.specialities?.map(spec => spec.name).join(', ') || 'N/A'}
            </div>
            {/* Display qualification if available */}
            {doctor.qualification && (
              <div className={styles.qualification}>{doctor.qualification}</div>
            )}
            <div className={styles.experience} data-testid="doctor-experience">{doctor.experience || 'N/A'}</div>
            {/* Removed languages display to match the image */}
          </div>
        </div>

        <div className={styles.rightSection}> {/* Wrapper for fee and button */}
          <div className={styles.fee} data-testid="doctor-fee">{doctor.fees || 'N/A'}</div>
          <button className={styles.bookButton}>Book Appointment</button>
           {/* Display consultation types if needed, though not in the image */}
           {/*
           <div className={styles.consultationTypes}>
             {doctor.video_consult && <span className={styles.videoConsult}>Video Consult</span>}
             {doctor.in_clinic && <span className={styles.inClinic}>In Clinic</span>}
           </div>
           */}
        </div>
      </div>

      {/* Clinic details moved below */}
      <div className={styles.clinicDetails}>
        {doctor.clinic && (
          <>
            <div className={styles.clinicName}>
              {/* Placeholder for Clinic Icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', color: '#555' }}>
                <path d="M19 2H5C3.346 2 2 3.346 2 5V19C2 20.654 3.346 22 5 22H19C20.654 22 22 20.654 22 19V5C22 3.346 20.654 2 19 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {doctor.clinic.name || 'N/A'}
            </div>
            <div className={styles.clinicAddress}>
              {/* Placeholder for Location Icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', color: '#555' }}>
                 <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {doctor.clinic.address?.locality || 'N/A'}
              {/* Removed city to match image */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;