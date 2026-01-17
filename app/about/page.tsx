import type { Metadata } from 'next';
import AboutPageContent from '../components/AboutPage/AboutPageContent';

export const metadata: Metadata = {
  title: 'About Us | Yellowtooths',
  description: 'Learn more about our agency, our process, and the team behind the magic.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}