import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const SERVER_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Photo upload state
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Surface assessment state
  const [assessment, setAssessment] = useState(null);
  const [assessLoading, setAssessLoading] = useState(false);
  const [assessError, setAssessError] = useState('');

  // Follow-up email state
  const [followup, setFollowup] = useState(null);
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupError, setFollowupError] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError('Failed to load job: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (type) => {
    const file = type === 'before' ? beforeFile : afterFile;
    if (!file) return;
    if (type === 'before') setUploadingBefore(true); else setUploadingAfter(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('photo', file);
      await api.post(`/jobs/${id}/upload-${type}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchJob();
      if (type === 'before') setBeforeFile(null); else setAfterFile(null);
    } catch (err) {
      setUploadError(err.response?.data?.error || `Failed to upload ${type} photo`);
    } finally {
      if (type === 'before') setUploadingBefore(false); else setUploadingAfter(false);
    }
  };

  const runSurfaceAssessment = async () => {
    setAssessLoading(true);
    setAssessError('');
    setAssessment(null);
    try {
      const res = await api.post(`/jobs/${id}/ai-surface-assess`);
      setAssessment(res.data.data || res.data.assessment || res.data);
    } catch (err) {
      setAssessError(err.response?.data?.error || err.response?.data?.message || 'Assessment failed.');
    } finally {
      setAssessLoading(false);
    }
  };

  const generateFollowup = async () => {
    setFollowupLoading(true);
    setFollowupError('');
    setFollowup(null);
    try {
      const res = await api.post(`/jobs/${id}/generate-followup`);
      setFollowup(res.data.data || res.data.email || res.data);
      setShowEmail(true);
    } catch (err) {
      setFollowupError(err.response?.data?.error || err.response?.data?.message || 'Email generation failed.');
    } finally {
      setFollowupLoading(false);
    }
  };

  const photoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}/${path.replace(/^\//, '')}`;
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading job details...</div>;
  if (error) return <div style={{ padding: 40 }}><div className="login-error">{error}</div></div>;
  if (!job) return null;

  const hasBefore = !!job.before_photo_path;
  const hasAfter = !!job.after_photo_path;

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  const labelStyle = { color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 };
  const valueStyle = { color: '#222', fontSize: 14, fontWeight: 500, marginBottom: 10 };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="back-btn" onClick={() => navigate('/jobs')}>← Back to Jobs</button>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
          Job #{job.job_number || id}
        </h1>
        <span style={{
          padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
          backgroundColor: job.status === 'completed' ? '#e8f5e9' : job.status === 'in_progress' ? '#fff3e0' : '#e3f2fd',
          color: job.status === 'completed' ? '#2e7d32' : job.status === 'in_progress' ? '#f57c00' : '#1565c0',
        }}>
          {job.status || 'scheduled'}
        </span>
      </div>

      {/* Job Details */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: '#333' }}>Job Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
          <div><p style={labelStyle}>Scheduled Date</p><p style={valueStyle}>{job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : '-'}</p></div>
          <div><p style={labelStyle}>Priority</p><p style={valueStyle}>{job.priority || '-'}</p></div>
          <div><p style={labelStyle}>Amount</p><p style={valueStyle}>{job.amount ? `$${Number(job.amount).toFixed(2)}` : '-'}</p></div>
          <div><p style={labelStyle}>Customer ID</p><p style={valueStyle}>{job.customer_id || '-'}</p></div>
          <div><p style={labelStyle}>Property ID</p><p style={valueStyle}>{job.property_id || '-'}</p></div>
          <div><p style={labelStyle}>Crew ID</p><p style={valueStyle}>{job.crew_id || '-'}</p></div>
        </div>
        {job.notes && (
          <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
            <p style={labelStyle}>Notes</p>
            <p style={{ ...valueStyle, whiteSpace: 'pre-wrap' }}>{job.notes}</p>
          </div>
        )}
      </div>

      {/* Before / After Photos */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: '#333' }}>📷 Before & After Photos</h3>
        {uploadError && <div className="login-error" style={{ marginBottom: 12 }}>{uploadError}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Before */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>Before</p>
            {hasBefore ? (
              <img
                src={photoUrl(job.before_photo_path)}
                alt="Before"
                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0e0e0' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{ width: '100%', height: 220, background: '#f5f5f5', borderRadius: 8, border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>
                No before photo
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                onChange={e => setBeforeFile(e.target.files[0])}
                style={{ marginBottom: 6, fontSize: 13 }}
                id="before-input"
              />
              <button
                className="btn btn-success"
                onClick={() => uploadPhoto('before')}
                disabled={!beforeFile || uploadingBefore}
                style={{ width: '100%' }}
              >
                {uploadingBefore ? 'Uploading...' : hasBefore ? 'Replace Before Photo' : 'Upload Before Photo'}
              </button>
            </div>
          </div>

          {/* After */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>After</p>
            {hasAfter ? (
              <img
                src={photoUrl(job.after_photo_path)}
                alt="After"
                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0e0e0' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{ width: '100%', height: 220, background: '#f5f5f5', borderRadius: 8, border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>
                No after photo
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                onChange={e => setAfterFile(e.target.files[0])}
                style={{ marginBottom: 6, fontSize: 13 }}
                id="after-input"
              />
              <button
                className="btn btn-success"
                onClick={() => uploadPhoto('after')}
                disabled={!afterFile || uploadingAfter}
                style={{ width: '100%' }}
              >
                {uploadingAfter ? 'Uploading...' : hasAfter ? 'Replace After Photo' : 'Upload After Photo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Surface Assessment */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: '#333' }}>🔍 AI Surface Assessment</h3>
          <button
            className="btn btn-success"
            onClick={runSurfaceAssessment}
            disabled={assessLoading}
          >
            {assessLoading ? 'Analyzing...' : 'Run Assessment'}
          </button>
        </div>
        {!hasBefore && (
          <p style={{ color: '#f57c00', fontSize: 13 }}>⚠️ Upload a before photo for vision-based analysis. Text analysis will be used if no photo is available.</p>
        )}
        {assessError && <div className="login-error">{assessError}</div>}
        {assessLoading && (
          <div className="ai-loading" style={{ padding: '20px 0' }}>
            <p style={{ fontSize: 14, color: '#2e7d32' }}>AI is analyzing the surface condition...</p>
            <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
          </div>
        )}
        {assessment && !assessLoading && (
          <div>
            {/* Severity badge */}
            {assessment.contamination_severity && (
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                  backgroundColor: assessment.contamination_severity === 'extreme' ? '#ffebee' : assessment.contamination_severity === 'heavy' ? '#fff3e0' : '#e8f5e9',
                  color: assessment.contamination_severity === 'extreme' ? '#b71c1c' : assessment.contamination_severity === 'heavy' ? '#e65100' : '#2e7d32',
                }}>
                  Contamination: {assessment.contamination_severity?.toUpperCase()}
                </span>
              </div>
            )}

            {assessment.surface_condition && (
              <p style={{ color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{assessment.surface_condition}</p>
            )}

            {assessment.recommended_approach && (
              <div style={{ background: '#f3f8ff', borderRadius: 6, padding: 12, marginTop: 8 }}>
                <strong style={{ color: '#1565c0' }}>Recommended Approach:</strong>
                <p style={{ margin: '4px 0 0', color: '#333', fontSize: 14 }}>{
                  Array.isArray(assessment.recommended_approach)
                    ? assessment.recommended_approach.join('\n')
                    : assessment.recommended_approach
                }</p>
              </div>
            )}

            {assessment.chemicals_recommended?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <strong>Recommended Chemicals:</strong>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {assessment.chemicals_recommended.map((c, i) => (
                    <span key={i} className="ai-badge">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {assessment.safety_precautions?.length > 0 && (
              <div style={{ marginTop: 10, background: '#fff8e1', borderRadius: 6, padding: 10 }}>
                <strong style={{ color: '#e65100' }}>⚠️ Safety Precautions:</strong>
                <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                  {assessment.safety_precautions.map((p, i) => <li key={i} style={{ fontSize: 13 }}>{p}</li>)}
                </ul>
              </div>
            )}

            {assessment.estimated_time_hours && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
                Estimated time: <strong>{assessment.estimated_time_hours} hours</strong>
              </p>
            )}

            {!assessment.surface_condition && !assessment.recommended_approach && (
              <pre style={{ fontSize: 12, color: '#666', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                {JSON.stringify(assessment, null, 2)}
              </pre>
            )}
          </div>
        )}
        {!assessment && !assessLoading && (
          <p style={{ color: '#aaa', fontSize: 13 }}>Click "Run Assessment" to analyze surface conditions using AI vision</p>
        )}
      </div>

      {/* Customer Follow-up Email */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: '#333' }}>✉️ Customer Follow-up Email</h3>
          <button
            className="btn btn-success"
            onClick={generateFollowup}
            disabled={followupLoading}
          >
            {followupLoading ? 'Generating...' : 'Generate Email'}
          </button>
        </div>
        {followupError && <div className="login-error">{followupError}</div>}
        {followupLoading && (
          <div className="ai-loading" style={{ padding: '20px 0' }}>
            <p style={{ fontSize: 14, color: '#2e7d32' }}>AI is writing a personalized follow-up email...</p>
            <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
          </div>
        )}
        {followup && !followupLoading && showEmail && (
          <div>
            {followup.subject && (
              <div style={{ marginBottom: 8 }}>
                <strong>Subject:</strong> <span style={{ color: '#1565c0' }}>{followup.subject}</span>
              </div>
            )}
            {(followup.body || typeof followup === 'string') && (
              <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 6, padding: 14 }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.7, color: '#333', fontFamily: 'inherit' }}>
                  {followup.body || followup}
                </pre>
              </div>
            )}
            {followup.care_tips?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <strong>Care Tips Included:</strong>
                <ul style={{ marginTop: 4 }}>{followup.care_tips.map((t, i) => <li key={i} style={{ fontSize: 13 }}>{t}</li>)}</ul>
              </div>
            )}
            {!followup.body && typeof followup === 'object' && !followup.subject && (
              <pre style={{ fontSize: 12, color: '#666', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                {JSON.stringify(followup, null, 2)}
              </pre>
            )}
          </div>
        )}
        {!followup && !followupLoading && (
          <p style={{ color: '#aaa', fontSize: 13 }}>Generate a personalized follow-up email with care tips and rebooking offer for this customer</p>
        )}
      </div>
    </div>
  );
}

export default JobDetail;
