// src/config/constants.js

export const APP_VERSION = 'v7.0.0';

export const GOOGLE_MAPS_API_KEY = '';

export const EXPENSE_TYPES = {
  monthly: { name: 'شهري', days: 30 },
  yearly: { name: 'سنوي', days: 365 }
};

export const TASK_PRIORITIES = {
  urgent: { name: 'مستعجل', color: 'red' },
  medium: { name: 'متوسط', color: 'yellow' },
  normal: { name: 'عادي', color: 'green' }
};

export const PROJECT_STATUS = {
  active: { name: 'نشط', color: 'blue' },
  paused: { name: 'متوقف', color: 'orange' },
  completed: { name: 'مكتمل', color: 'green' }
};

export const USER_ROLES = {
  owner: { name: 'مالك', level: 3 },
  manager: { name: 'مدير', level: 2 },
  member: { name: 'عضو', level: 1 }
};

export const STATUS_COLORS = {
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-400'
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400'
  },
  yellow: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-400'
  },
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400'
  },
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400'
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-400'
  },
  gray: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    badge: 'bg-gray-500/20 text-gray-400'
  }
};

export const FILE_LIMITS = {
  image: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024
};

export const IMAGE_COMPRESSION = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8
};

export const VIDEO_COMPRESSION = {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.7
};

export const QUOTES = [
  'النجاح لا يأتي من الفراغ، بل من العمل الجاد والإصرار',
  'كل إنجاز عظيم بدأ بخطوة صغيرة',
  'التخطيط الجيد نصف النجاح',
  'المال خادم جيد لكنه سيد سيء',
  'الإدارة الحكيمة للمال مفتاح الاستقرار',
  'استثمر في نفسك، فهو أفضل استثمار',
  'الميزانية ليست قيداً، بل خريطة طريق للنجاح',
  'لا تدخر ما تبقى بعد الإنفاق، بل أنفق ما تبقى بعد الادخار'
];

export const GREETINGS = [
  'مرحباً',
  'أهلاً',
  'السلام عليكم',
  'صباح الخير',
  'مساء الخير',
  'حياك الله',
  'نورت',
  'أهلاً وسهلاً',
  'يا هلا',
  'مرحبتين',
  'الله يحييك',
  'تشرفنا',
  'فرصة سعيدة',
  'يوم سعيد',
  'وقت ممتع'
];
