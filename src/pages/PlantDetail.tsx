/**
 * Plant Detail Page
 *
 * Shows detailed information about a specific plant:
 * - Plant image and name
 * - AI diagnosis results
 * - Detected issues
 * - Treatment timeline with recommendations
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlant, useDeletePlant } from '../hooks/usePlants';
import { TreatmentTimeline } from '../components/TreatmentTimeline';
import { useAuth } from '../hooks/useAuth';
import type { DiagnosisResult } from '../services/database.types';
import './PlantDetail.css';

export function PlantDetail() {
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();
  const { data: plant, isLoading } = usePlant(plantId);
  const { user, signOut } = useAuth();
  const deletePlant = useDeletePlant();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (isLoading) {
    return (
      <div className="plant-detail-loading">
        <div className="loading-spinner" />
        <p>Loading plant details...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="plant-detail-error">
        <h2>Plant not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const plantData = plant as any;
  const diagnosis = plantData.diagnosis as DiagnosisResult | null;

  const handleDelete = async () => {
    if (!plantId) return;

    try {
      await deletePlant.mutateAsync(plantId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete plant:', error);
      alert('Failed to delete plant. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // ProtectedRoute will automatically redirect to /auth
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  // Get care tips from AI diagnosis or fallback to defaults
  const getCareTips = (diagnosis: DiagnosisResult | null) => {
    // Debug: Log the diagnosis object to console
    console.log('Diagnosis object:', diagnosis);
    console.log('Has careTips?', diagnosis?.careTips);
    console.log('careTips length:', diagnosis?.careTips?.length);

    // Use AI-generated care tips if available
    if (diagnosis?.careTips && diagnosis.careTips.length > 0) {
      console.log('Using AI-generated care tips:', diagnosis.careTips);
      return diagnosis.careTips.slice(0, 5);
    }

    // Fallback to general tips if AI didn't provide them
    console.log('Using fallback tips - AI tips not available');
    return [
      {
        icon: '💡',
        title: 'Monitor Daily',
        description: 'Check your plant at the same time each day to catch early warning signs of stress or disease.'
      },
      {
        icon: '💧',
        title: 'Water Wisely',
        description: 'Use the finger test: stick your finger 2 inches into soil. Water only when dry at that depth.'
      },
      {
        icon: '☀️',
        title: 'Light Requirements',
        description: 'Ensure your plant gets appropriate light for its species.'
      },
      {
        icon: '🌡️',
        title: 'Temperature Control',
        description: 'Most houseplants prefer temperatures between 65-75°F. Avoid placing near drafty windows or heating vents.'
      }
    ];
  };

  return (
    <div className="plant-detail">
      <header className="detail-header">
        <div className="container">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <div className="header-actions">
            <button className="action-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
              Share
            </button>
            <button className="action-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export Report
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="action-button delete-action-button"
              disabled={deletePlant.isPending}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              {deletePlant.isPending ? 'Deleting...' : 'Delete'}
            </button>
            <div className="user-menu-container">
              <button
                className="action-button user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar-small">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
              {showUserMenu && (
                <>
                  <div className="menu-overlay" onClick={() => setShowUserMenu(false)} />
                  <div className="user-dropdown-detail">
                    <div className="dropdown-item dropdown-info">
                      <div className="user-info-label">Signed in as</div>
                      <div className="user-info-email">{user?.email}</div>
                    </div>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item dropdown-button"
                      onClick={handleLogout}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="detail-main container">
        <div className="detail-grid">
          {/* Left Column - Image */}
          <div className="detail-sidebar">
            <div className="plant-image-card">
              <img src={plantData.image_url} alt={plantData.plant_name || 'Plant'} />
            </div>

            {/* Tips and Tricks Section */}
            <div className="tips-section">
              <div className="tips-header">
                <span className="tips-icon">💡</span>
                <h3>Care Tips</h3>
              </div>

              <div className="tips-content">
                {getCareTips(diagnosis).map((tip, index) => (
                  <div key={index} className="tip-item">
                    <div className="tip-icon-wrapper">
                      <span className="tip-icon">{tip.icon}</span>
                    </div>
                    <div className="tip-text">
                      <h4 className="tip-title">{tip.title}</h4>
                      <p className="tip-description">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Delete Plant?</h3>
                <p>
                  Are you sure you want to delete this plant? This will also delete all
                  treatment records. This action cannot be undone.
                </p>
                <div className="modal-actions">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      handleDelete();
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Column - Plant Info and Diagnosis */}
          <div className="detail-content">
            {/* Plant Header */}
            <div className="plant-header">
              <div className="plant-title-row">
                <div>
                  <h1 className="plant-title">{plantData.plant_name || 'Unknown Plant'}</h1>
                  <p className="plant-scientific-name">
                    {plantData.plant_name ? plantData.plant_name.toLowerCase().replace(' ', ' ') : ''}
                  </p>
                </div>
                {diagnosis?.issues && diagnosis.issues[0] && (
                  <span className={`severity-badge severity-${diagnosis.issues[0].severity}`}>
                    {diagnosis.issues[0].severity}
                  </span>
                )}
              </div>

              {diagnosis?.confidence && (
                <div className="confidence-meter">
                  <div className="confidence-label">
                    <span>AI Confidence</span>
                    <span className="confidence-value">
                      {Math.round(diagnosis.confidence * 100)}%
                    </span>
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${diagnosis.confidence * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Diagnosis */}
            {diagnosis?.issues && diagnosis.issues.length > 0 && (
              <div className="diagnosis-section">
                <h2>Diagnosis</h2>
                {diagnosis.issues.map((issue: any, index: number) => (
                  <div key={index}>
                    <h3 className="diagnosis-title">{issue.name}</h3>
                    <p className="diagnosis-description">{issue.description}</p>

                    {/* Possible Causes */}
                    {issue.causes && issue.causes.length > 0 && (
                      <div className="causes-section">
                        <h4 className="causes-title">Possible Causes</h4>
                        <ul className="causes-list">
                          {issue.causes.map((cause: string, causeIndex: number) => (
                            <li key={causeIndex}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {diagnosis?.recommendations && diagnosis.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h2>Recommendations</h2>
                <div className="recommendations-list">
                  {diagnosis.recommendations
                    .sort((a: any, b: any) => a.priority - b.priority)
                    .map((rec: any, index: number) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 12l2 2 4-4"/>
                          </svg>
                        </div>
                        <div className="recommendation-text">{rec.action}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Treatment Timeline - Full Width */}
        {plantId && (
          <div className="timeline-section-full">
            <TreatmentTimeline plantId={plantId} />
          </div>
        )}
      </main>
    </div>
  );
}
