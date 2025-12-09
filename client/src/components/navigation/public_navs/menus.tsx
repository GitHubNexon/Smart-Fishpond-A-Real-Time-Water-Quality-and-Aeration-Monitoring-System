import {
  Home,
  FileText,
  Megaphone,
  Info,
  Award,
  MapPin,
  Users,
  TrendingUp,
  FileCheck,
  Building,
  ClipboardList,
  Receipt,
  ShieldCheck,
  Calendar,
  HeartPulse,
  HandHeart,
  Shield,
  Trophy,
  GraduationCap,
  Hammer,
  Leaf,
  Heart,
  Briefcase,
} from 'lucide-react';

// --- Submenu definitions ---
const homeSubMenus = [
  {
    title: 'Introduction',
    href: '/#introduction',
    description: 'Welcome to Barangay Luntian',
    icon: Home,
  },
  {
    title: 'Barangay Statistics',
    href: '/#barangay-statistics',
    description: 'View demographic and community data',
    icon: TrendingUp,
  },
  {
    title: 'Officials',
    href: '/#officials',
    description: 'Meet our barangay leaders',
    icon: Users,
  },
];

const servicesSubMenus = [
  {
    title: 'Overview of E-services',
    href: '/services',
    description: 'Access all available barangay online services in one place.',
    icon: FileText,
  },
  {
    title: 'Certificate of Indigency',
    href: '/services/certificate-of-indigency',
    description: 'Apply for indigency certificate',
    icon: FileText,
  },
  {
    title: 'Barangay Clearance',
    href: '/services/barangay-clearance',
    description: 'Request barangay clearance',
    icon: FileCheck,
  },
  {
    title: 'Certificate of Residency',
    href: '/services/certificate-of-residency',
    description: 'Proof of residence certificate',
    icon: MapPin,
  },
  {
    title: 'Community Tax Certificate',
    href: '/services/certificate-of-community-tax',
    description: 'Cedula and tax documents',
    icon: Receipt,
  },
  {
    title: 'Business Permit',
    href: '/services/business-permit',
    description: 'Apply for business permits',
    icon: Briefcase,
  },
  {
    title: 'Certificate of Complaint',
    href: '/services/certificate-complaint',
    description: 'File a formal complaint',
    icon: ClipboardList,
  },
  {
    title: 'Building Permit',
    href: '/services/building-permit',
    description: 'Construction permit application',
    icon: Building,
  },
  {
    title: 'Good Moral Certificate',
    href: '/services/certificate-of-good-moral',
    description: 'Character reference certificate',
    icon: Award,
  },
];

const announcementsSubMenus = [
  {
    title: 'All Announcements',
    href: '/announcements',
    description: 'View all updates',
    icon: Megaphone,
  },
  {
    title: 'Community Activity',
    href: '/announcements/community-activity',
    description: 'Local events and gatherings',
    icon: Calendar,
  },
  {
    title: 'Health Program',
    href: '/announcements/health-program',
    description: 'Health services and initiatives',
    icon: HeartPulse,
  },
  {
    title: 'Social Services',
    href: '/announcements/social-services',
    description: 'Community assistance programs',
    icon: HandHeart,
  },
  {
    title: 'Safety & Security',
    href: '/announcements/safety-security',
    description: 'Security alerts and updates',
    icon: Shield,
  },
  {
    title: 'Sports & Recreation',
    href: '/announcements/sports-recreation',
    description: 'Sports events and activities',
    icon: Trophy,
  },
  {
    title: 'Education & Training',
    href: '/announcements/education-training',
    description: 'Learning opportunities',
    icon: GraduationCap,
  },
];

const projectsSubMenus = [
  {
    title: 'Overall Projects',
    href: '/projects',
    description: 'Comprehensive list of all ongoing and completed projects',
    icon: Hammer,
  },
  {
    title: 'Infrastructure',
    href: '/projects/infrastructure',
    description: 'Roads, facilities, and buildings',
    icon: Hammer,
  },
  {
    title: 'Environment',
    href: '/projects/environment',
    description: 'Green and eco-friendly initiatives',
    icon: Leaf,
  },
  {
    title: 'Health & Sanitation',
    href: '/projects/health-sanitation',
    description: 'Healthcare and cleanliness programs',
    icon: Heart,
  },
  {
    title: 'Education & Youth',
    href: '/projects/education-youth',
    description: 'Youth development programs',
    icon: GraduationCap,
  },
  {
    title: 'Public Safety',
    href: '/projects/public-safety',
    description: 'Peace and order initiatives',
    icon: ShieldCheck,
  },
  {
    title: 'Livelihood Assistance',
    href: '/projects/livelihood-assistance',
    description: 'Economic support programs',
    icon: Briefcase,
  },
];

const aboutSubMenus = [
  {
    title: 'Introduction',
    href: '/about',
    description: 'About Barangay Luntian',
    icon: Info,
  },
  {
    title: 'Vision & Mission',
    href: '/about#vision-mission',
    description: 'Our goals and objectives',
    icon: Award,
  },
  {
    title: 'Core Values',
    href: '/about#core-values',
    description: 'Principles we uphold',
    icon: Heart,
  },
  {
    title: 'History',
    href: '/about#history',
    description: 'Our heritage and timeline',
    icon: FileText,
  },
  {
    title: 'Organizational Structure',
    href: '/about/organizational-structures',
    description: 'Leadership hierarchy',
    icon: Users,
  },
  {
    title: 'Barangay Map',
    href: '/about/barangay-map',
    description: 'Location and boundaries',
    icon: MapPin,
  },
  {
    title: 'Accomplishments',
    href: '/about/accomplishments',
    description: 'Our achievements and milestones',
    icon: Trophy,
  },
];

export {
  homeSubMenus,
  servicesSubMenus,
  announcementsSubMenus,
  projectsSubMenus,
  aboutSubMenus,
};
