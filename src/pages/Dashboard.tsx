/**
 * Dashboard Page
 *
 * Main user interface showing:
 * - List of user's plants
 * - Upload new plant functionality
 * - Navigation to individual plant details
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePlants } from '../hooks/usePlants';
import { ImageUpload } from '../components/ImageUpload';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: plants, isLoading } = usePlants(user?.id);
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadSuccess = (plantId: string) => {
    setShowUpload(false);
    navigate(`/plant/${plantId}`);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="dashboard">
      <main className="dashboard-main container">
        {!showUpload && (
          <div className="hero-section">
            <h1 className="hero-title">AI-Powered Plant Health Diagnosis</h1>
            <p className="hero-subtitle">
              Upload a photo of your plant and get instant AI-powered diagnosis,
              treatment recommendations, and recovery timelines.
            </p>
          </div>
        )}

        {showUpload ? (
          <div className="upload-section">
            <div className="section-header">
              <h2>Upload Plant Image</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
            <ImageUpload onSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <>
            <div className="upload-card">
              <h2 className="upload-title">Upload Plant Image</h2>
              <p className="upload-description">
                Take a photo or upload an image of your plant for instant diagnosis
              </p>
              <ImageUpload onSuccess={handleUploadSuccess} />
            </div>

            <div className="section-header">
              <div>
                <h2>Recent Diagnoses</h2>
                <p className="section-subtitle">Track your plant health history</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="view-all-button"
              >
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Loading your plants...</p>
              </div>
            ) : plants && plants.length > 0 ? (
              <div className="plants-grid">
                {plants.map((plant) => {
                  const diagnosis = plant.diagnosis as any;
                  const issueCount = diagnosis?.issues?.length || 0;
                  const severity =
                    diagnosis?.issues?.[0]?.severity || 'unknown';

                  return (
                    <div
                      key={plant.id}
                      className="plant-card"
                      onClick={() => navigate(`/plant/${plant.id}`)}
                    >
                      <div className="plant-image">
                        <img src={plant.image_url} alt={plant.plant_name || 'Plant'} />
                        {issueCount > 0 && (
                          <div className={`severity-badge severity-${severity}`}>
                            {severity}
                          </div>
                        )}
                      </div>

                      <div className="plant-info">
                        <h3>{plant.plant_name || 'Unknown Plant'}</h3>

                        {diagnosis?.issues && diagnosis.issues.length > 0 && (
                          <p className="plant-issue">{diagnosis.issues[0].name}</p>
                        )}

                        {severity !== 'unknown' && (
                          <div className={`severity-badge-small severity-${severity}`}>
                            {severity}
                          </div>
                        )}

                        <p className="plant-date">{formatDate(plant.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
                <h3>No plants yet</h3>
                <p>Upload your first plant image to get started</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="btn btn-primary"
                >
                  Add Your First Plant
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
