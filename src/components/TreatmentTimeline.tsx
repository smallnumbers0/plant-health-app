/**
 * Treatment Timeline Component
 *
 * Displays a visual timeline of treatment steps with:
 * - Date-based progression
 * - Completion tracking
 * - Interactive checkboxes
 * - Visual indicators for status
 */

import { useTreatments, useUpdateTreatment } from '../hooks/useTreatments';
import './TreatmentTimeline.css';

interface TreatmentTimelineProps {
  plantId: string;
}

export function TreatmentTimeline({ plantId }: TreatmentTimelineProps) {
  const { data: treatments, isLoading } = useTreatments(plantId);
  const updateTreatment = useUpdateTreatment();

  const handleToggleComplete = (treatmentId: string, currentStatus: boolean) => {
    updateTreatment.mutate({
      treatmentId,
      completed: !currentStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="timeline-loading">
        <div className="loading-spinner" />
        <p>Loading treatment plan...</p>
      </div>
    );
  }

  if (!treatments || treatments.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No treatment plan available</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="treatment-timeline">
      <div className="timeline-header">
        <h2>Treatment Timeline</h2>
        <p className="timeline-subtitle">
          Follow these steps for optimal recovery. Track your progress as you go.
        </p>
      </div>

      <div className="timeline-container">
        {treatments.map((treatment, index) => {
          const upcoming = isUpcoming(treatment.date);
          const past = isPast(treatment.date) && !treatment.completed;

          return (
            <div
              key={treatment.id}
              className={`timeline-item ${treatment.completed ? 'completed' : ''} ${
                upcoming ? 'upcoming' : ''
              } ${past ? 'overdue' : ''}`}
            >
              <div className="timeline-marker">
                <div className="timeline-dot">
                  {treatment.completed && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {index < treatments.length - 1 && <div className="timeline-line" />}
              </div>

              <div className="timeline-content">
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="timeline-step">Step {treatment.step}</div>
                    <div className="timeline-date">{formatDate(treatment.date)}</div>
                  </div>

                  <p className="timeline-description">{treatment.description}</p>

                  <label className="timeline-checkbox">
                    <input
                      type="checkbox"
                      checked={treatment.completed}
                      onChange={() =>
                        handleToggleComplete(treatment.id, treatment.completed)
                      }
                      disabled={updateTreatment.isPending}
                    />
                    <span>Mark as completed</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="timeline-footer">
        <div className="timeline-stats">
          <div className="stat">
            <span className="stat-value">
              {treatments.filter((t) => t.completed).length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{treatments.length}</span>
            <span className="stat-label">Total Steps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
