import SEOHead from './SEOHead.jsx';
import './NotFound.css';

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="404 — Page Not Found | Dev Kumar"
        description="The page you're looking for doesn't exist. Head back to the homepage."
        path="/404"
      />
      <div className="not-found">
        <h1 className="not-found-code">404</h1>
        <p className="not-found-message">
          Oops — this page doesn't exist.
        </p>
        <a href="/" className="not-found-link">
          ← Back to Home
        </a>
      </div>
    </>
  );
}
