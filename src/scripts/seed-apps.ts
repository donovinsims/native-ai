/**
 * Seed script for Apps table
 * 
 * Run with: npm run seed:apps
 * Or: npx tsx src/scripts/seed-apps.ts
 * 
 * Creates 30 realistic iOS/macOS apps with:
 * - 15 iOS, 10 macOS, 5 Cross-platform
 * - Mix of Free (15), Paid (10), Subscription (5)
 * - Categories: Productivity (8), Design (6), Developer Tools (5), Utilities (4), Social (3), Entertainment (2), Finance (2)
 */

import { db } from '@/db';
import { apps } from '@/db/schema';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomRating(): number {
  // Realistic distribution: mostly 4.0-5.0
  const base = 3.5 + Math.random() * 1.5;
  return Math.round(base * 10) / 10;
}

function getRandomReviews(): number {
  // Log distribution: 50-5000
  const log = Math.random() * Math.log10(5000 / 50);
  return Math.floor(50 * Math.pow(10, log));
}

const now = new Date();
const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

interface AppSeed {
  name: string;
  developer: string;
  description: string;
  shortDescription?: string;
  category: string;
  platform: 'iOS' | 'macOS' | 'Cross-platform';
  isPaid: boolean;
  pricingModel: 'Free' | 'Freemium' | 'Paid' | 'Subscription';
  price: string;
  iconUrl: string;
  screenshotUrls: string[];
  appStoreUrl: string;
  websiteUrl: string;
  tags: string[];
  features: string[];
  isFeatured?: boolean;
}

const sampleApps: AppSeed[] = [
  // PRODUCTIVITY (8)
  {
    name: 'Notion',
    developer: 'Notion Labs',
    description: 'Write, plan, collaborate, and get organized. Notion is all you need — in one tool. Build your own workspace from scratch, or use templates for notes, tasks, wikis, and databases.',
    shortDescription: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    category: 'Productivity',
    platform: 'Cross-platform',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/0F0F0F/FFFFFF?text=N',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/0F0F0F/FFFFFF?text=Notion+Screenshot+1',
      'https://via.placeholder.com/1200x800/1A1A1A/FFFFFF?text=Notion+Screenshot+2',
      'https://via.placeholder.com/1200x800/2D2D2D/FFFFFF?text=Notion+Screenshot+3'
    ],
    appStoreUrl: 'https://apps.apple.com/app/notion/id1232780281',
    websiteUrl: 'https://notion.so',
    tags: ['Editor Pick', 'Cloud Sync', 'Collaboration'],
    features: ['Real-time collaboration', 'Database views', 'AI assistant', 'Offline mode'],
    isFeatured: true
  },
  {
    name: 'Things 3',
    developer: 'Cultured Code',
    description: 'Things 3 is an award-winning personal task manager that helps you achieve your goals. It combines powerful features with simplicity through elegant design.',
    shortDescription: 'Award-winning personal task manager.',
    category: 'Productivity',
    platform: 'Cross-platform',
    isPaid: true,
    pricingModel: 'Paid',
    price: '$9.99',
    iconUrl: 'https://via.placeholder.com/512/3B82F6/FFFFFF?text=T3',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/3B82F6/FFFFFF?text=Things+Screenshot+1',
      'https://via.placeholder.com/1200x800/2563EB/FFFFFF?text=Things+Screenshot+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/things-3/id904237743',
    websiteUrl: 'https://culturedcode.com/things',
    tags: ['Editor Pick', 'Offline Mode', 'Apple Watch'],
    features: ['Quick entry', 'Today view', 'Projects & areas', 'Recurring tasks'],
    isFeatured: true
  },
  {
    name: 'Bear',
    developer: 'Shiny Frog',
    description: 'Bear is a beautiful, flexible writing app for crafting notes and prose. Use it for everything from quick notes to in-depth essays.',
    shortDescription: 'Beautiful markdown notes.',
    category: 'Productivity',
    platform: 'Cross-platform',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/E25950/FFFFFF?text=Bear',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/E25950/FFFFFF?text=Bear+Screenshot+1',
      'https://via.placeholder.com/1200x800/D94840/FFFFFF?text=Bear+Screenshot+2',
      'https://via.placeholder.com/1200x800/C43830/FFFFFF?text=Bear+Screenshot+3'
    ],
    appStoreUrl: 'https://apps.apple.com/app/bear/id1016366447',
    websiteUrl: 'https://bear.app',
    tags: ['Editor Pick', 'Markdown', 'Cloud Sync'],
    features: ['Markdown support', 'Beautiful themes', 'Tags organization', 'Export options']
  },
  {
    name: 'Fantastical',
    developer: 'Flexibits',
    description: 'Fantastical is the award-winning calendar and tasks app with natural language parsing, beautiful design, and powerful features.',
    shortDescription: 'Award-winning calendar app.',
    category: 'Productivity',
    platform: 'Cross-platform',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$4.99/month',
    iconUrl: 'https://via.placeholder.com/512/EF4444/FFFFFF?text=F',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/EF4444/FFFFFF?text=Fantastical+1',
      'https://via.placeholder.com/1200x800/DC2626/FFFFFF?text=Fantastical+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/fantastical-calendar-tasks/id718043190',
    websiteUrl: 'https://flexibits.com/fantastical',
    tags: ['Subscription', 'Calendar', 'Apple Watch'],
    features: ['Natural language input', 'Calendar sets', 'Weather forecast', 'Widget support'],
    isFeatured: true
  },
  {
    name: 'Craft',
    developer: 'Luki Labs',
    description: 'Craft is a powerful document editor that brings back the joy of writing. Create beautiful documents with a tool built for the way you think.',
    shortDescription: 'Beautiful document editor.',
    category: 'Productivity',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/8B5CF6/FFFFFF?text=C',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/8B5CF6/FFFFFF?text=Craft+1',
      'https://via.placeholder.com/1200x800/7C3AED/FFFFFF?text=Craft+2',
      'https://via.placeholder.com/1200x800/6D28D9/FFFFFF?text=Craft+3'
    ],
    appStoreUrl: 'https://apps.apple.com/app/craft-docs/id1487937127',
    websiteUrl: 'https://craft.do',
    tags: ['New', 'Innovative', 'Cloud Sync'],
    features: ['Block-based editor', 'Daily notes', 'Backlinks', 'PDF export']
  },
  {
    name: 'GoodNotes 6',
    developer: 'Time Base Technology',
    description: 'GoodNotes transforms your iPad or iPhone into digital paper. Take handwritten notes, annotate PDFs, and organize your ideas.',
    shortDescription: 'Digital paper for notes.',
    category: 'Productivity',
    platform: 'iOS',
    isPaid: true,
    pricingModel: 'Paid',
    price: '$8.99',
    iconUrl: 'https://via.placeholder.com/512/10B981/FFFFFF?text=GN',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/10B981/FFFFFF?text=GoodNotes+1',
      'https://via.placeholder.com/1200x800/059669/FFFFFF?text=GoodNotes+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/goodnotes-6/id1444383602',
    websiteUrl: 'https://goodnotes.com',
    tags: ['Apple Pencil', 'Education', 'PDF'],
    features: ['Handwriting recognition', 'Shape recognition', 'PDF annotation', 'Flashcards']
  },
  {
    name: 'Todoist',
    developer: 'Doist',
    description: 'Organize your work and life with Todoist. The to-do list app trusted by millions for managing tasks, projects, and achieving goals.',
    shortDescription: 'Task management for everyone.',
    category: 'Productivity',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/E44332/FFFFFF?text=TD',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/E44332/FFFFFF?text=Todoist+1',
      'https://via.placeholder.com/1200x800/D93020/FFFFFF?text=Todoist+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/todoist-to-do-list-tasks/id585829637',
    websiteUrl: 'https://todoist.com',
    tags: ['Cross-platform', 'Collaboration', 'Widgets'],
    features: ['Natural language dates', 'Projects', 'Labels', 'Reminders']
  },
  {
    name: 'Apple Notes',
    developer: 'Apple',
    description: 'Notes lets you quickly capture thoughts, organize important information, and collaborate with others seamlessly across all your Apple devices.',
    shortDescription: 'Apple\'s built-in notes app.',
    category: 'Productivity',
    platform: 'Cross-platform',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/F59E0B/FFFFFF?text=N',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/F59E0B/FFFFFF?text=Notes+1',
      'https://via.placeholder.com/1200x800/D97706/FFFFFF?text=Notes+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/notes/id1110145109',
    websiteUrl: 'https://apple.com',
    tags: ['Built-in', 'iCloud', 'Offline Mode'],
    features: ['iCloud sync', 'Scanning', 'Folders', 'Collaboration']
  },
  
  // DESIGN (6)
  {
    name: 'Figma',
    developer: 'Figma, Inc.',
    description: 'Figma is a collaborative design tool that allows teams to design, prototype, and gather feedback all in the browser. It\'s the standard for interface design.',
    shortDescription: 'Collaborative design tool.',
    category: 'Design',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/A259FF/FFFFFF?text=F',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/A259FF/FFFFFF?text=Figma+1',
      'https://via.placeholder.com/1200x800/1ABCFE/FFFFFF?text=Figma+2',
      'https://via.placeholder.com/1200x800/0ACF83/FFFFFF?text=Figma+3'
    ],
    appStoreUrl: 'https://apps.apple.com/app/figma/id1152747299',
    websiteUrl: 'https://figma.com',
    tags: ['Editor Pick', 'Collaboration', 'Cloud Sync'],
    features: ['Real-time collaboration', 'Prototyping', 'Dev mode', 'Plugins'],
    isFeatured: true
  },
  {
    name: 'Procreate',
    developer: 'Savage Interactive',
    description: 'Procreate is the most powerful and intuitive digital illustration app available for iPad. Create expressive sketches, paintings, and illustrations.',
    shortDescription: 'Professional illustration app.',
    category: 'Design',
    platform: 'iOS',
    isPaid: true,
    pricingModel: 'Paid',
    price: '$12.99',
    iconUrl: 'https://via.placeholder.com/512/1F2937/FFFFFF?text=P',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/1F2937/FFFFFF?text=Procreate+1',
      'https://via.placeholder.com/1200x800/111827/FFFFFF?text=Procreate+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/procreate/id425073498',
    websiteUrl: 'https://procreate.com',
    tags: ['Editor Pick', 'Apple Pencil', 'Professional'],
    features: ['1000+ brushes', 'Time-lapse', 'Layer system', 'Color management'],
    isFeatured: true
  },
  {
    name: 'Affinity Designer 2',
    developer: 'Serif Labs',
    description: 'Affinity Designer 2 is the fastest, smoothest, most precise vector graphic design software. Create stunning illustrations, UI designs, and brand assets.',
    shortDescription: 'Professional vector design.',
    category: 'Design',
    platform: 'macOS',
    isPaid: true,
    pricingModel: 'Paid',
    price: '$69.99',
    iconUrl: 'https://via.placeholder.com/512/30B8DB/FFFFFF?text=AD',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/30B8DB/FFFFFF?text=Affinity+1',
      'https://via.placeholder.com/1200x800/1CA0C0/FFFFFF?text=Affinity+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/affinity-designer-2/id1616831348',
    websiteUrl: 'https://affinity.serif.com/designer',
    tags: ['Professional', 'No Subscription', 'Universal'],
    features: ['Vector & raster', 'Symbols', 'Artboards', 'Export presets']
  },
  {
    name: 'Pixelmator Pro',
    developer: 'Pixelmator Team',
    description: 'Pixelmator Pro is an incredibly powerful image editor. Use machine learning to enhance photos, edit images, and create stunning designs.',
    shortDescription: 'AI-powered image editor.',
    category: 'Design',
    platform: 'macOS',
    isPaid: true,
    pricingModel: 'Paid',
    price: '$49.99',
    iconUrl: 'https://via.placeholder.com/512/2DD4BF/000000?text=Px',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/2DD4BF/000000?text=Pixelmator+1',
      'https://via.placeholder.com/1200x800/14B8A6/FFFFFF?text=Pixelmator+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/pixelmator-pro/id1289583905',
    websiteUrl: 'https://pixelmator.com/pro',
    tags: ['Machine Learning', 'Photo Editing', 'No Subscription'],
    features: ['ML Enhance', 'Layers', 'Effects', 'RAW support']
  },
  {
    name: 'Canva',
    developer: 'Canva',
    description: 'Canva makes design simple for everyone. Create stunning graphics, presentations, videos, and more with thousands of professional templates.',
    shortDescription: 'Graphic design made easy.',
    category: 'Design',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/00C4CC/FFFFFF?text=Ca',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/00C4CC/FFFFFF?text=Canva+1',
      'https://via.placeholder.com/1200x800/00A3B0/FFFFFF?text=Canva+2',
      'https://via.placeholder.com/1200x800/008090/FFFFFF?text=Canva+3'
    ],
    appStoreUrl: 'https://apps.apple.com/app/canva-design-photo-video/id897446215',
    websiteUrl: 'https://canva.com',
    tags: ['Templates', 'Social Media', 'Collaboration'],
    features: ['Templates', 'Brand kit', 'AI tools', 'Resize']
  },
  {
    name: 'Sketch',
    developer: 'Sketch B.V.',
    description: 'Sketch is the all-in-one platform for digital design. Design, prototype, and collaborate on your ideas — all in one powerful application.',
    shortDescription: 'Digital design platform.',
    category: 'Design',
    platform: 'macOS',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$10/month',
    iconUrl: 'https://via.placeholder.com/512/F7B500/000000?text=S',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/F7B500/000000?text=Sketch+1',
      'https://via.placeholder.com/1200x800/E5A700/000000?text=Sketch+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/sketch/id1438150218',
    websiteUrl: 'https://sketch.com',
    tags: ['Subscription', 'Professional', 'Collaboration'],
    features: ['Symbols', 'Libraries', 'Prototyping', 'Developer handoff']
  },

  // DEVELOPER TOOLS (5)
  {
    name: 'Raycast',
    developer: 'Raycast',
    description: 'Raycast is a blazingly fast and extensible launcher. Search anything, control your tools, and automate tasks with a powerful command interface.',
    shortDescription: 'Supercharged productivity launcher.',
    category: 'Developer Tools',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/FF6363/FFFFFF?text=R',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/FF6363/FFFFFF?text=Raycast+1',
      'https://via.placeholder.com/1200x800/E54545/FFFFFF?text=Raycast+2',
      'https://via.placeholder.com/1200x800/CC3030/FFFFFF?text=Raycast+3'
    ],
    appStoreUrl: 'https://apps.apple.com/app/raycast/id1534246345',
    websiteUrl: 'https://raycast.com',
    tags: ['Editor Pick', 'Innovative', 'Extensions'],
    features: ['Quick search', 'Extensions', 'Script commands', 'Window management'],
    isFeatured: true
  },
  {
    name: 'Visual Studio Code',
    developer: 'Microsoft',
    description: 'Visual Studio Code is a lightweight but powerful source code editor. It comes with built-in support for TypeScript, JavaScript, and much more.',
    shortDescription: 'Powerful code editor.',
    category: 'Developer Tools',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/007ACC/FFFFFF?text=VS',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/007ACC/FFFFFF?text=VSCode+1',
      'https://via.placeholder.com/1200x800/0066B8/FFFFFF?text=VSCode+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/visual-studio-code/id1484085277',
    websiteUrl: 'https://code.visualstudio.com',
    tags: ['Open Source', 'Extensions', 'Git'],
    features: ['IntelliSense', 'Debugging', 'Extensions', 'Git integration']
  },
  {
    name: 'GitHub Desktop',
    developer: 'GitHub',
    description: 'GitHub Desktop simplifies your development workflow. Focus on what matters instead of fighting with Git. Access all your repositories easily.',
    shortDescription: 'Git made simple.',
    category: 'Developer Tools',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/24292E/FFFFFF?text=GH',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/24292E/FFFFFF?text=GitHub+1',
      'https://via.placeholder.com/1200x800/1B1F23/FFFFFF?text=GitHub+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/github-desktop/id1270374900',
    websiteUrl: 'https://desktop.github.com',
    tags: ['Open Source', 'Git', 'Collaboration'],
    features: ['Branch management', 'Pull requests', 'Conflict resolution', 'Dark mode']
  },
  {
    name: 'Xcode',
    developer: 'Apple',
    description: 'Xcode is Apple\'s integrated development environment. Build apps for Mac, iPhone, iPad, Apple Watch, and Apple TV with powerful tools.',
    shortDescription: 'Apple\'s IDE for all platforms.',
    category: 'Developer Tools',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/147EFB/FFFFFF?text=X',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/147EFB/FFFFFF?text=Xcode+1',
      'https://via.placeholder.com/1200x800/0066CC/FFFFFF?text=Xcode+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/xcode/id497799835',
    websiteUrl: 'https://developer.apple.com/xcode',
    tags: ['Apple', 'Swift', 'iOS Development'],
    features: ['Swift Playgrounds', 'Interface Builder', 'Instruments', 'Simulator']
  },
  {
    name: 'iTerm2',
    developer: 'George Nachman',
    description: 'iTerm2 is a replacement for Terminal and the successor to iTerm. It brings the terminal into the modern age with features you never knew you always wanted.',
    shortDescription: 'Modern terminal emulator.',
    category: 'Developer Tools',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/000000/00FF00?text=IT',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/000000/00FF00?text=iTerm+1',
      'https://via.placeholder.com/1200x800/1A1A1A/00FF00?text=iTerm+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/iterm2/id1218390048',
    websiteUrl: 'https://iterm2.com',
    tags: ['Open Source', 'Terminal', 'Developer'],
    features: ['Split panes', 'Search', 'Autocomplete', 'Shell integration']
  },

  // UTILITIES (4)
  {
    name: '1Password',
    developer: 'AgileBits',
    description: '1Password remembers all your passwords for you. Save your passwords and log in to sites with a single click. It\'s that simple.',
    shortDescription: 'Password manager.',
    category: 'Utilities',
    platform: 'Cross-platform',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$2.99/month',
    iconUrl: 'https://via.placeholder.com/512/0094F5/FFFFFF?text=1P',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/0094F5/FFFFFF?text=1Password+1',
      'https://via.placeholder.com/1200x800/007ACC/FFFFFF?text=1Password+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/1password-password-manager/id1511601750',
    websiteUrl: 'https://1password.com',
    tags: ['Security', 'Cloud Sync', 'Family'],
    features: ['Password generator', 'Watchtower', '2FA', 'Travel mode'],
    isFeatured: true
  },
  {
    name: 'CleanMyMac X',
    developer: 'MacPaw',
    description: 'CleanMyMac X brings a powerful set of new features to help you safely remove junk files, malware, and optimize your Mac for maximum speed.',
    shortDescription: 'Mac cleaner & optimizer.',
    category: 'Utilities',
    platform: 'macOS',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$39.95/year',
    iconUrl: 'https://via.placeholder.com/512/10B981/FFFFFF?text=CM',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/10B981/FFFFFF?text=CleanMyMac+1',
      'https://via.placeholder.com/1200x800/059669/FFFFFF?text=CleanMyMac+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/cleanmymac-x/id1339170533',
    websiteUrl: 'https://cleanmymac.com',
    tags: ['Subscription', 'Optimization', 'Security'],
    features: ['Space cleaning', 'Malware removal', 'Optimization', 'Uninstaller']
  },
  {
    name: 'Alfred',
    developer: 'Running with Crayons',
    description: 'Alfred boosts your efficiency with hotkeys, keywords, text expansion, and more. Search your Mac and the web, and control your Mac using custom actions.',
    shortDescription: 'Productivity launcher.',
    category: 'Utilities',
    platform: 'macOS',
    isPaid: true,
    pricingModel: 'Paid',
    price: '£34',
    iconUrl: 'https://via.placeholder.com/512/5C3D98/FFFFFF?text=A',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/5C3D98/FFFFFF?text=Alfred+1',
      'https://via.placeholder.com/1200x800/4C2D88/FFFFFF?text=Alfred+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/alfred/id1621570581',
    websiteUrl: 'https://alfredapp.com',
    tags: ['Workflows', 'Automation', 'Productivity'],
    features: ['Workflows', 'Clipboard history', 'Snippets', 'File navigation']
  },
  {
    name: 'Amphetamine',
    developer: 'William Gustafson',
    description: 'Amphetamine prevents your Mac from sleeping. Perfect for keeping your Mac awake while downloading files, running presentations, or anything else.',
    shortDescription: 'Keep your Mac awake.',
    category: 'Utilities',
    platform: 'macOS',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/3B82F6/FFFFFF?text=Amp',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/3B82F6/FFFFFF?text=Amphetamine+1',
      'https://via.placeholder.com/1200x800/2563EB/FFFFFF?text=Amphetamine+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/amphetamine/id937984704',
    websiteUrl: 'https://github.com/w-gustafson/amphetamine',
    tags: ['Menu Bar', 'Free', 'Simple'],
    features: ['Triggers', 'Timer', 'AppleScript', 'Menu bar control']
  },

  // SOCIAL (3)
  {
    name: 'Slack',
    developer: 'Slack Technologies',
    description: 'Slack brings all your team communication into one place. It\'s real-time messaging, archiving, and search for modern teams.',
    shortDescription: 'Team communication hub.',
    category: 'Social',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/4A154B/FFFFFF?text=S',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/4A154B/FFFFFF?text=Slack+1',
      'https://via.placeholder.com/1200x800/611F69/FFFFFF?text=Slack+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/slack/id618783545',
    websiteUrl: 'https://slack.com',
    tags: ['Collaboration', 'Business', 'Integrations'],
    features: ['Channels', 'Direct messages', 'Apps', 'Huddles']
  },
  {
    name: 'Discord',
    developer: 'Discord Inc.',
    description: 'Discord is the easiest way to talk over voice, video, and text. Chat, hang out, and stay close with your friends and communities.',
    shortDescription: 'Talk, chat, hang out.',
    category: 'Social',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Free',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/5865F2/FFFFFF?text=D',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/5865F2/FFFFFF?text=Discord+1',
      'https://via.placeholder.com/1200x800/4752C4/FFFFFF?text=Discord+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/discord-talk-chat-hang-out/id985746746',
    websiteUrl: 'https://discord.com',
    tags: ['Gaming', 'Voice Chat', 'Communities'],
    features: ['Voice channels', 'Screen share', 'Servers', 'Bots']
  },
  {
    name: 'Ivory',
    developer: 'Tapbots',
    description: 'Ivory is a beautifully designed Mastodon client from the makers of Tweetbot. Experience the fediverse with a premium client.',
    shortDescription: 'Premium Mastodon client.',
    category: 'Social',
    platform: 'iOS',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$1.99/month',
    iconUrl: 'https://via.placeholder.com/512/6366F1/FFFFFF?text=I',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/6366F1/FFFFFF?text=Ivory+1',
      'https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Ivory+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/ivory-for-mastodon-by-tapbots/id6444602274',
    websiteUrl: 'https://tapbots.com/ivory',
    tags: ['Mastodon', 'Social', 'Premium'],
    features: ['Timeline sync', 'Mute filters', 'Multiple accounts', 'Customization']
  },

  // ENTERTAINMENT (2)
  {
    name: 'Spotify',
    developer: 'Spotify AB',
    description: 'Spotify gives you instant access to millions of songs – from old favorites to the latest hits. Stream music and podcasts on your iPhone, iPad, or Mac.',
    shortDescription: 'Music streaming.',
    category: 'Entertainment',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/1DB954/FFFFFF?text=Sp',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/1DB954/FFFFFF?text=Spotify+1',
      'https://via.placeholder.com/1200x800/1AA34A/FFFFFF?text=Spotify+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/spotify-music-and-podcasts/id324684580',
    websiteUrl: 'https://spotify.com',
    tags: ['Music', 'Podcasts', 'Streaming'],
    features: ['Playlists', 'Offline mode', 'Lyrics', 'Social sharing']
  },
  {
    name: 'Apple TV',
    developer: 'Apple',
    description: 'Watch movies, shows, and live programming with Apple TV. Subscribe to channels, rent movies, or watch Apple Originals with Apple TV+.',
    shortDescription: 'Streaming entertainment.',
    category: 'Entertainment',
    platform: 'iOS',
    isPaid: false,
    pricingModel: 'Freemium',
    price: 'Free',
    iconUrl: 'https://via.placeholder.com/512/000000/FFFFFF?text=TV',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/000000/FFFFFF?text=AppleTV+1',
      'https://via.placeholder.com/1200x800/1A1A1A/FFFFFF?text=AppleTV+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/apple-tv/id1174078549',
    websiteUrl: 'https://apple.com/apple-tv-plus',
    tags: ['Streaming', '4K', 'Originals'],
    features: ['Apple TV+', 'Channels', 'Rent & Buy', 'Family Sharing']
  },

  // FINANCE (2)
  {
    name: 'Copilot',
    developer: 'Copilot Money',
    description: 'Copilot is the smart money tracker that helps you understand your finances. Track spending, manage subscriptions, and reach your financial goals.',
    shortDescription: 'Smart money tracker.',
    category: 'Finance',
    platform: 'iOS',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$9.99/month',
    iconUrl: 'https://via.placeholder.com/512/6366F1/FFFFFF?text=$',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/6366F1/FFFFFF?text=Copilot+1',
      'https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Copilot+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/copilot-track-budget-money/id1447330651',
    websiteUrl: 'https://copilot.money',
    tags: ['New', 'Innovative', 'Budgeting'],
    features: ['Bank sync', 'Categories', 'Goals', 'Net worth']
  },
  {
    name: 'YNAB',
    developer: 'YNAB',
    description: 'YNAB (You Need A Budget) helps you break the paycheck-to-paycheck cycle, get out of debt, and save more money. Every dollar gets a job.',
    shortDescription: 'Budgeting that works.',
    category: 'Finance',
    platform: 'iOS',
    isPaid: true,
    pricingModel: 'Subscription',
    price: '$14.99/month',
    iconUrl: 'https://via.placeholder.com/512/85C0EA/FFFFFF?text=YN',
    screenshotUrls: [
      'https://via.placeholder.com/1200x800/85C0EA/FFFFFF?text=YNAB+1',
      'https://via.placeholder.com/1200x800/6DB0DC/FFFFFF?text=YNAB+2'
    ],
    appStoreUrl: 'https://apps.apple.com/app/ynab-you-need-a-budget/id1010865877',
    websiteUrl: 'https://ynab.com',
    tags: ['Budgeting', 'Subscription', 'Bank Sync'],
    features: ['Rule-based budgeting', 'Goals', 'Reports', 'Bank sync']
  }
];

async function seedApps() {
  console.log('🌱 Seeding apps database...\n');

  try {
    // Clear existing apps
    await db.delete(apps);
    console.log('✓ Cleared existing apps\n');

    const appsToInsert = sampleApps.map((app) => {
      const createdAt = randomDate(sixMonthsAgo, twoMonthsAgo);
      const updatedAt = randomDate(twoMonthsAgo, now);

      return {
        name: app.name,
        slug: slugify(app.name),
        developer: app.developer,
        description: app.description,
        category: app.category,
        platform: app.platform,
        isPaid: app.isPaid,
        price: app.price,
        rating: getRandomRating(),
        reviewsCount: getRandomReviews(),
        iconUrl: app.iconUrl,
        screenshotUrls: app.screenshotUrls,
        appStoreUrl: app.appStoreUrl,
        websiteUrl: app.websiteUrl,
        tags: app.tags,
        features: app.features,
        isFeatured: app.isFeatured ?? false,
        createdAt,
        updatedAt
      };
    });

    // Insert all apps
    await db.insert(apps).values(appsToInsert);

    console.log(`✓ Inserted ${appsToInsert.length} apps\n`);

    // Print summary
    const platformCounts = {
      iOS: appsToInsert.filter((a) => a.platform === 'iOS').length,
      macOS: appsToInsert.filter((a) => a.platform === 'macOS').length,
      'Cross-platform': appsToInsert.filter((a) => a.platform === 'Cross-platform').length
    };

    const pricingCounts = {
      Free: appsToInsert.filter((a) => !a.isPaid).length,
      Paid: appsToInsert.filter((a) => a.isPaid).length
    };

    const categoryCounts = appsToInsert.reduce(
      (acc, app) => {
        acc[app.category] = (acc[app.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log('📊 Summary:');
    console.log('  Platform Distribution:');
    Object.entries(platformCounts).forEach(([platform, count]) => {
      console.log(`    ${platform}: ${count}`);
    });

    console.log('  Pricing Distribution:');
    Object.entries(pricingCounts).forEach(([pricing, count]) => {
      console.log(`    ${pricing}: ${count}`);
    });

    console.log('  Category Distribution:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`    ${category}: ${count}`);
    });

    console.log('\n✅ Apps seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding apps:', error);
    process.exit(1);
  }
}

seedApps();
