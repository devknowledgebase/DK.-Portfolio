export const Arrowright = ({ style }) => (
  <svg style={style} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.125 10H16.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.25 4.375L16.875 10L11.25 15.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Logo = ({ style, onClick }) => (
  <svg style={style} onClick={onClick} viewBox="0 0 50 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.492 18.76H0V0H9.492C15.68 0 19.6 3.444 19.6 9.38C19.6 15.316 15.68 18.76 9.492 18.76ZM9.492 4.732H5.264V14.028H9.492C12.824 14.028 13.972 13.608 13.972 9.38C13.972 5.152 12.824 4.732 9.492 4.732Z" fill="currentColor" />
    <path d="M27.0968 18.76H21.8328V0H27.0968V6.972H30.8768L35.4408 0H41.7408L35.2448 9.212L41.6008 18.76H35.3008L30.9328 12.096H27.0968V18.76Z" fill="currentColor" />
    <path d="M49.9853 18.76H43.1533V13.384H49.9853V18.76Z" fill="currentColor" />
  </svg>
);
