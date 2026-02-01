/**
 * College Type Styling with Images for Government and Private
 * Used throughout the application for consistent visual representation
 */

export const collegeTypeConfig = {
  Government: {
    color: '#1e40af',
    bgColor: 'bg-blue-900',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-900',
    textColor: 'text-blue-900',
    badge: 'badge-blue',
    gradient: 'from-blue-900 to-blue-800',
    icon: '🏛️',
    description: 'Government College',
    // Government college image pattern
    backgroundImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&q=80',
    backgroundPattern: 'linear-gradient(135deg, rgba(30, 64, 175, 0.85) 0%, rgba(37, 99, 235, 0.85) 100%), url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&q=80)',
    overlayColor: 'rgba(30, 64, 175, 0.85)'
  },
  Private: {
    color: '#15803d',
    bgColor: 'bg-green-900',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-900',
    textColor: 'text-green-900',
    badge: 'badge-green',
    gradient: 'from-green-900 to-green-800',
    icon: '🏢',
    description: 'Private College',
    // Private college image pattern
    backgroundImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&q=80',
    backgroundPattern: 'linear-gradient(135deg, rgba(21, 128, 61, 0.85) 0%, rgba(34, 197, 94, 0.85) 100%), url(https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&q=80)',
    overlayColor: 'rgba(21, 128, 61, 0.85)'
  },
  Aided: {
    color: '#f59e0b',
    bgColor: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-700',
    badge: 'badge-amber',
    gradient: 'from-amber-400 to-amber-600',
    icon: '🎓',
    description: 'Aided College'
  },
  Autonomous: {
    color: '#8b5cf6',
    bgColor: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-700',
    badge: 'badge-purple',
    gradient: 'from-purple-400 to-purple-600',
    icon: '⭐',
    description: 'Autonomous College'
  }
};

export const getCollegeTypeConfig = (collegeType) => {
  return collegeTypeConfig[collegeType] || collegeTypeConfig.Private;
};

export const getTypeGradient = (collegeType) => {
  const config = getCollegeTypeConfig(collegeType);
  return config.gradient;
};

export const getTypeBadgeClass = (collegeType) => {
  const config = getCollegeTypeConfig(collegeType);
  return `${config.bgColor} text-white`;
};

export const getTypeIcon = (collegeType) => {
  return getCollegeTypeConfig(collegeType).icon;
};
