import { 
  Activity, Apple, Award, Ban, Banknote, Bath, Bike, Book, BookOpen, 
  Brain, Briefcase, Brush, Calculator, Calendar, Camera, Car, Cat, CheckCircle, 
  ChefHat, Code, Coffee, Coins, Compass, CreditCard, CupSoda, Dog, DollarSign, 
  Droplet, Droplets, Dumbbell, Edit, FileText, Film, Flame, FlaskConical, Flower2, 
  Footprints, Gamepad2, Gift, Globe, GraduationCap, Hammer, Headphones, Heart, 
  HeartPulse, Home, Image, Key, Laptop, Library, Lightbulb, ListTodo, Mail, MapPin, 
  MessageCircle, Mic, Monitor, Moon, Music, Palette, PenTool, Pencil, Phone, 
  PieChart, PiggyBank, Pizza, Plane, Puzzle, Radio, Rocket, Scissors, Search, 
  Shield, ShoppingBag, ShoppingCart, ShowerHead, Smartphone, Smile, Snowflake, 
  Sparkles, Star, Sun, Syringe, Tag, Target, Terminal, ThumbsUp, Timer, Trash, 
  TrendingUp, Trophy, Tv, Umbrella, Users, Utensils, Video, Wallet, Watch, Wifi, 
  Wind, Wrench, Zap
} from 'lucide-react-native';

const PALETTES = {
  blue: { bg: '#3b82f6', lightBg: '#dbeafe', darkColor: '#1e40af' },
  teal: { bg: '#14b8a6', lightBg: '#ccfbf1', darkColor: '#115e59' },
  green: { bg: '#22c55e', lightBg: '#dcfce7', darkColor: '#166534' },
  red: { bg: '#ef4444', lightBg: '#fee2e2', darkColor: '#991b1b' },
  rose: { bg: '#f43f5e', lightBg: '#ffe4e6', darkColor: '#9f1239' },
  orange: { bg: '#f97316', lightBg: '#ffedd5', darkColor: '#9a3412' },
  amber: { bg: '#f59e0b', lightBg: '#fef3c7', darkColor: '#92400e' },
  yellow: { bg: '#eab308', lightBg: '#fef08a', darkColor: '#854d0e' },
  purple: { bg: '#a855f7', lightBg: '#f3e8ff', darkColor: '#6b21a8' },
  indigo: { bg: '#6366f1', lightBg: '#e0e7ff', darkColor: '#3730a3' },
  pink: { bg: '#ec4899', lightBg: '#fce7f3', darkColor: '#9d174d' },
  sky: { bg: '#0ea5e9', lightBg: '#e0f2fe', darkColor: '#075985' },
  slate: { bg: '#64748b', lightBg: '#f1f5f9', darkColor: '#334155' }
};

export const getHabitDisplay = (habitName = '', category = '') => {
  const name = (habitName + ' ' + category).toLowerCase();

  // 1. Water & Hydration
  if (name.match(/water|drink|hydrate|inom|soda|fluid/)) {
    return { ...PALETTES.sky, icon: name.includes('soda') ? CupSoda : Droplets };
  }
  
  // 2. Reading & Studying
  if (name.match(/read|book|study|learn|aral|journal|write|homework/)) {
    let icon = BookOpen;
    if (name.includes('study') || name.includes('aral') || name.includes('learn')) icon = GraduationCap;
    if (name.includes('journal') || name.includes('write')) icon = PenTool;
    return { ...PALETTES.indigo, icon };
  }
  
  // 3. Cardio & Movement
  if (name.match(/run|walk|cardio|takbo|jog|step|move|hike/)) {
    let icon = Activity;
    if (name.includes('step') || name.includes('walk') || name.includes('hike')) icon = Footprints;
    return { ...PALETTES.orange, icon };
  }
  if (name.match(/bike|cycle|biking/)) return { ...PALETTES.orange, icon: Bike };
  
  // 4. Sleep & Recovery
  if (name.match(/sleep|rest|tulog|nap|bed|wake|early/)) {
    let icon = Moon;
    if (name.includes('wake') || name.includes('early') || name.includes('morning')) icon = Sun;
    return { ...PALETTES.indigo, icon };
  }
  
  // 5. Food & Diet
  if (name.match(/eat|food|meal|kain|breakfast|lunch|dinner|diet|sugar|cook|bake/)) {
    let icon = Utensils;
    if (name.match(/coffee|tea/)) icon = Coffee;
    if (name.match(/apple|fruit|veg/)) icon = Apple;
    if (name.match(/cook|bake/)) icon = ChefHat;
    if (name.match(/pizza|fast food|cheat/)) icon = Pizza;
    return { ...PALETTES.rose, icon };
  }
  
  // 6. Coding & Technology
  if (name.match(/code|program|app|web|dev|tech|computer|software/)) {
    let icon = Code;
    if (name.match(/computer|laptop/)) icon = Laptop;
    if (name.match(/phone|mobile|screen/)) icon = Smartphone;
    return { ...PALETTES.teal, icon };
  }
  
  // 7. Gym & Strength Training (Place before Work to catch "Work Out")
  if (name.match(/gym|lift|push up|squat|workout|work out|fitness|exercise|weight|train/)) {
    return { ...PALETTES.green, icon: Dumbbell };
  }
  
  // 8. Work & Career
  if (name.match(/work|office|job|meeting|career|email|task|project|side line|gig|hustle/)) {
    let icon = Briefcase;
    if (name.match(/email|mail/)) icon = Mail;
    if (name.match(/task|project|todo/)) icon = ListTodo;
    if (name.match(/goal|target/)) icon = Target;
    if (name.match(/side line|gig|hustle/)) icon = CheckCircle; // distinct for sidelines
    return { ...PALETTES.slate, icon };
  }
  
  // 9. Finance & Money
  if (name.match(/money|save|budget|finance|ipon|spend|expense|invest|crypto/)) {
    let icon = Banknote;
    if (name.match(/save|ipon|piggy/)) icon = PiggyBank;
    if (name.match(/invest|crypto|trend/)) icon = TrendingUp;
    if (name.match(/card|credit/)) icon = CreditCard;
    if (name.match(/coin/)) icon = Coins;
    return { ...PALETTES.yellow, icon };
  }
  
  // 10. Mindfulness & Mental Health
  if (name.match(/meditate|mind|breathe|focus|relax|therapy|grateful/)) {
    let icon = Brain;
    if (name.match(/breathe|relax/)) icon = Wind;
    if (name.match(/grateful|smile/)) icon = Smile;
    return { ...PALETTES.purple, icon };
  }
  
  // 11. Gaming & Hobbies
  if (name.match(/game|play|laro|gta|ps5|xbox|pc|nintendo/)) {
    let icon = Gamepad2;
    if (name.match(/puzzle/)) icon = Puzzle;
    return { ...PALETTES.pink, icon };
  }
  
  // 12. Cleaning & Household
  if (name.match(/clean|tidy|sweep|wash|linis|chore|laundry|dish/)) {
    let icon = Sparkles;
    if (name.match(/laundry|wash|shower|bath/)) icon = ShowerHead;
    if (name.match(/sweep|brush/)) icon = Brush;
    if (name.match(/trash|garbage/)) icon = Trash;
    return { ...PALETTES.sky, icon };
  }
  
  // 13. Music & Arts
  if (name.match(/music|piano|guitar|sing|song|listen/)) {
    let icon = Music;
    if (name.match(/listen|podcast/)) icon = Headphones;
    if (name.match(/sing|mic/)) icon = Mic;
    return { ...PALETTES.amber, icon };
  }
  if (name.match(/art|draw|paint|design|create/)) {
    return { ...PALETTES.pink, icon: Palette };
  }
  if (name.match(/photo|camera|video|film/)) {
    let icon = Camera;
    if (name.match(/video|film/)) icon = Video;
    return { ...PALETTES.amber, icon };
  }
  
  // 14. Social & Relationships
  if (name.match(/friend|family|social|call|meet|date|partner/)) {
    let icon = Users;
    if (name.match(/call|phone/)) icon = Phone;
    if (name.match(/message|text/)) icon = MessageCircle;
    if (name.match(/date|partner|love/)) icon = Heart;
    return { ...PALETTES.red, icon };
  }

  // 15. Bad Habits / Abstinence
  if (name.match(/quit|stop|no |less |ban|avoid|smoke|alcohol/)) {
    let icon = Ban;
    if (name.match(/smoke|cigarette/)) icon = Flame; // Using Flame as proxy
    if (name.match(/shield/)) icon = Shield;
    return { ...PALETTES.red, icon };
  }

  // 16. Shopping & Errands
  if (name.match(/shop|grocery|buy|mall|store/)) {
    let icon = ShoppingCart;
    if (name.match(/bag/)) icon = ShoppingBag;
    if (name.match(/price|tag/)) icon = Tag;
    return { ...PALETTES.sky, icon };
  }

  // 17. Pets & Animals
  if (name.match(/pet|dog|cat|walk dog|feed/)) {
    let icon = Heart; // Default for pets if dog/cat misses
    if (name.match(/dog/)) icon = Dog;
    if (name.match(/cat/)) icon = Cat;
    return { ...PALETTES.amber, icon };
  }

  // 18. Medical & Health
  if (name.match(/pill|med|vitamin|doctor|sick|health/)) {
    let icon = HeartPulse;
    if (name.match(/pill|med|syringe/)) icon = Syringe;
    if (name.match(/flask|science/)) icon = FlaskConical;
    return { ...PALETTES.red, icon };
  }

  // 19. Travel & Transport
  if (name.match(/travel|drive|commute|flight|trip/)) {
    let icon = Car;
    if (name.match(/flight|plane/)) icon = Plane;
    if (name.match(/trip|globe|world/)) icon = Globe;
    return { ...PALETTES.blue, icon };
  }

  // 20. Miscellaneous/Generic Matches
  if (name.match(/fix|repair|build/)) return { ...PALETTES.slate, icon: Wrench };
  if (name.match(/time|track|pomodoro/)) return { ...PALETTES.slate, icon: Timer };
  if (name.match(/idea|think|brainstorm/)) return { ...PALETTES.yellow, icon: Lightbulb };
  if (name.match(/news|article/)) return { ...PALETTES.slate, icon: FileText };
  if (name.match(/movie|watch|show/)) return { ...PALETTES.indigo, icon: Tv };
  
  // Default generic style - deterministic color based on name hash
  const paletteKeys = Object.keys(PALETTES);
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % paletteKeys.length;
  const selectedPalette = PALETTES[paletteKeys[colorIndex]];

  return { ...selectedPalette, icon: CheckCircle };
};
