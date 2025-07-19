import { Game, GameCategory } from '../types/Game';

/**
 * Main featured game configuration
 */
export const featuredGame: Game = {
  id: 'grow-garden',
  title: 'Grow Garden',
  description: 'Plant, grow, and manage your beautiful garden in this relaxing gardening game.',
  longDescription: 'Experience the joy of gardening with Grow Garden! Plant seeds, water your plants, and watch your garden bloom into a beautiful paradise. This relaxing game lets you create your own virtual garden sanctuary.',
  iframeUrl: 'https://html5.gamedistribution.com/rvvASMiM/fd8e0b5b8b8e4c4e8f8e8e8e8e8e8e8e/index.html',
  thumbnailUrl: '/multi_title_image.webp',
  category: GameCategory.GARDEN,
  tags: ['gardening', 'relaxing', 'simulation', 'plants', 'nature'],
  featured: true,
  seoSlug: 'grow-garden',
  metaDescription: 'Play Grow Garden online - a relaxing gardening simulation game where you plant, grow, and manage your own beautiful virtual garden.',
  instructions: [
    'Click to plant seeds in empty soil',
    'Water your plants regularly to help them grow',
    'Harvest mature plants for rewards',
    'Use rewards to buy new seeds and decorations',
    'Create your perfect garden layout'
  ],
  controls: [
    'Mouse: Click to interact with plants and tools',
    'Drag: Move items and decorations around your garden',
    'Scroll: Zoom in and out of your garden view'
  ]
};

/**
 * Additional garden games collection
 */
export const moreGardenGames: Game[] = [
  {
    id: 'plant-paradise',
    title: 'Plant Paradise',
    description: 'Create a tropical paradise with exotic plants and flowers.',
    longDescription: 'Transform your space into a lush tropical paradise! Collect rare plants, design beautiful landscapes, and create the ultimate botanical sanctuary.',
    iframeUrl: 'https://html5.gamedistribution.com/plant-paradise/index.html',
    thumbnailUrl: '/multi_run_1.webp',
    category: GameCategory.GARDEN,
    tags: ['tropical', 'plants', 'paradise', 'design', 'collection'],
    featured: false,
    seoSlug: 'plant-paradise',
    metaDescription: 'Create your own tropical plant paradise in this beautiful gardening game with exotic plants and stunning landscapes.'
  },
  {
    id: 'garden-puzzle',
    title: 'Garden Puzzle',
    description: 'Solve puzzles to unlock new areas of your garden.',
    longDescription: 'Combine puzzle-solving with gardening! Match flowers, solve garden-themed puzzles, and unlock new areas to expand your growing garden empire.',
    iframeUrl: 'https://html5.gamedistribution.com/garden-puzzle/index.html',
    thumbnailUrl: '/multi_run_2.webp',
    category: GameCategory.PUZZLE,
    tags: ['puzzle', 'match-3', 'garden', 'strategy', 'unlock'],
    featured: false,
    seoSlug: 'garden-puzzle',
    metaDescription: 'Solve garden-themed puzzles to unlock new areas and grow your garden in this engaging puzzle-gardening game.'
  },
  {
    id: 'flower-power',
    title: 'Flower Power',
    description: 'Grow colorful flowers and create stunning bouquets.',
    longDescription: 'Discover the power of flowers! Grow a variety of colorful blooms, learn about different flower types, and create beautiful bouquets to share.',
    iframeUrl: 'https://html5.gamedistribution.com/flower-power/index.html',
    thumbnailUrl: '/multi_run_3.webp',
    category: GameCategory.CASUAL,
    tags: ['flowers', 'colorful', 'bouquets', 'creative', 'relaxing'],
    featured: false,
    seoSlug: 'flower-power',
    metaDescription: 'Grow beautiful flowers and create stunning bouquets in this colorful and relaxing flower gardening game.'
  },
  {
    id: 'vegetable-farm',
    title: 'Vegetable Farm',
    description: 'Grow fresh vegetables and manage your own farm.',
    longDescription: 'Start your own vegetable farm! Plant seeds, tend to your crops, harvest fresh vegetables, and build a thriving agricultural business.',
    iframeUrl: 'https://html5.gamedistribution.com/vegetable-farm/index.html',
    thumbnailUrl: '/multi_run_4.webp',
    category: GameCategory.STRATEGY,
    tags: ['vegetables', 'farming', 'harvest', 'management', 'agriculture'],
    featured: false,
    seoSlug: 'vegetable-farm',
    metaDescription: 'Manage your own vegetable farm, grow fresh crops, and build a successful agricultural business in this farming simulation game.'
  },
  {
    id: 'garden-design',
    title: 'Garden Design',
    description: 'Design and decorate beautiful garden landscapes.',
    longDescription: 'Unleash your creativity with Garden Design! Plan layouts, choose plants, add decorations, and create stunning garden landscapes that reflect your personal style.',
    iframeUrl: 'https://html5.gamedistribution.com/garden-design/index.html',
    thumbnailUrl: '/logo512.png',
    category: GameCategory.CASUAL,
    tags: ['design', 'decoration', 'landscape', 'creative', 'planning'],
    featured: false,
    seoSlug: 'garden-design',
    metaDescription: 'Design beautiful garden landscapes with plants, decorations, and creative layouts in this garden design simulation game.'
  },
  {
    id: 'seed-planting',
    title: 'Seed Planting',
    description: 'Learn about different seeds and watch them grow.',
    longDescription: 'Discover the magic of growth with Seed Planting! Learn about different types of seeds, understand plant life cycles, and watch your garden come to life.',
    iframeUrl: 'https://html5.gamedistribution.com/seed-planting/index.html',
    thumbnailUrl: '/multi_title_image.webp',
    category: GameCategory.GARDEN,
    tags: ['seeds', 'education', 'growth', 'learning', 'nature'],
    featured: false,
    seoSlug: 'seed-planting',
    metaDescription: 'Learn about seeds and plant growth in this educational gardening game that teaches about nature and plant life cycles.'
  }
];

/**
 * All games collection (featured + more games)
 */
export const allGames: Game[] = [featuredGame, ...moreGardenGames];

/**
 * Get game by ID
 */
export const getGameById = (id: string): Game | undefined => {
  return allGames.find(game => game.id === id);
};

/**
 * Get games by category
 */
export const getGamesByCategory = (category: GameCategory): Game[] => {
  return allGames.filter(game => game.category === category);
};

/**
 * Get featured games
 */
export const getFeaturedGames = (): Game[] => {
  return allGames.filter(game => game.featured);
};