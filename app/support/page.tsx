import { Metadata } from 'next';
import SupportPageContent from './SupportPageContent';

export const metadata: Metadata = {
  title: 'Support Us | ewgf.gg',
  description: 'Support ewgf.gg and help us keep the site running for the Tekken community.',
};

export default function SupportPage() {
  return <SupportPageContent />;
}
