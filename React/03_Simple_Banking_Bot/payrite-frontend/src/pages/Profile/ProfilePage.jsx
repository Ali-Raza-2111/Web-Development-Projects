import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Edit2,
  Camera,
  Shield,
  Bell,
  Trash2,
  Loader2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
import './Profile.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || 'individual',
    state: user?.state || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      businessName: user?.businessName || '',
      businessType: user?.businessType || 'individual',
      state: user?.state || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>

        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            <div className="avatar-circle">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                <span>{user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}</span>
              )}
            </div>
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>
          <div className="avatar-info">
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.email}</p>
            <span className="member-badge">
              <Calendar size={14} />
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <div className="section-header">
            <h3>
              <User size={20} />
              <span>Personal Information</span>
            </h3>
            {!isEditing ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{user?.firstName || '-'}</p>
              )}
            </div>
            <div className="info-field">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{user?.lastName || '-'}</p>
              )}
            </div>
            <div className="info-field">
              <label>
                <Mail size={14} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled
                />
              ) : (
                <p>{user?.email || '-'}</p>
              )}
            </div>
            <div className="info-field">
              <label>
                <Phone size={14} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+234"
                />
              ) : (
                <p>{user?.phone || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="profile-section">
          <div className="section-header">
            <h3>
              <Building size={20} />
              <span>Business Information</span>
            </h3>
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label>Business Name (Optional)</label>
              {isEditing ? (
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p>{user?.businessName || '-'}</p>
              )}
            </div>
            <div className="info-field">
              <label>Tax Category</label>
              {isEditing ? (
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="individual">Individual</option>
                  <option value="sole-proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="company">Company</option>
                </select>
              ) : (
                <p style={{ textTransform: 'capitalize' }}>{user?.businessType?.replace('-', ' ') || 'Individual'}</p>
              )}
            </div>
            <div className="info-field full-width">
              <label>
                <MapPin size={14} />
                State of Residence
              </label>
              {isEditing ? (
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select State</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja (FCT)</option>
                  <option value="rivers">Rivers</option>
                  <option value="ogun">Ogun</option>
                  <option value="kano">Kano</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p style={{ textTransform: 'capitalize' }}>{user?.state || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="profile-section">
          <div className="section-header">
            <h3>
              <Bell size={20} />
              <span>Preferences</span>
            </h3>
          </div>

          <div className="preference-list">
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-label">Email Notifications</span>
                <span className="preference-desc">Receive updates about your analyses</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-label">Tax Tips & Updates</span>
                <span className="preference-desc">Get Nigerian tax news and tips</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="profile-section">
          <div className="section-header">
            <h3>
              <Shield size={20} />
              <span>Security</span>
            </h3>
          </div>

          <div className="security-actions">
            <button className="btn btn-secondary">
              Change Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="profile-section danger-zone">
          <div className="section-header">
            <h3>
              <Trash2 size={20} />
              <span>Danger Zone</span>
            </h3>
          </div>

          <p className="danger-text">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>

          <button className="btn btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
