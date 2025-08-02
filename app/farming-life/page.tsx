import FarmingLifePage from '../../src/pages/FarmingLifePage'

export const metadata = {
  title: 'Farming Life - Build Your Dream Farm | Grow Garden',
  description: 'Play Farming Life online! Plant crops, raise animals, build farm structures, and create your agricultural empire. The ultimate farming simulation game.',
  openGraph: {
    title: 'Farming Life - Build Your Dream Farm',
    description: 'Experience the joy of farming life! Plant crops, raise livestock, and build your agricultural empire in this immersive farming simulation.',
    type: 'website',
    url: 'https://growgarden.cc/farming-life',
  },
  alternates: {
    canonical: `https://growgarden.cc/farming-life`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farming Life - Build Your Dream Farm',
    description: 'Plant crops, raise animals, and create your agricultural empire in this realistic farming simulation game.',
  }
}

export default function FarmingLife() {
  return <FarmingLifePage />
}