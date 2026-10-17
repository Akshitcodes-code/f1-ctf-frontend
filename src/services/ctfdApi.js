import axios from 'axios';

// Configure Axios client with credentials for session-based cookie authentication
const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Helper to extract CSRF token from CTFd cookies or meta tags
export const getCsrfToken = async () => {
  // 1. Check if token is already in document cookies
  const match = document.cookie.match(/csrf_token=([^;]+)/) || document.cookie.match(/session=([^;]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // 2. Check window.init if CTFd injected it
  if (typeof window !== 'undefined' && window.init && window.init.csrfNonce) {
    return window.init.csrfNonce;
  }

  // 3. Try to fetch from CTFd meta or /api/v1/users/me
  try {
    const res = await api.get('/api/v1/users/me');
    if (res.data && res.data.data && res.data.data.nonce) {
      return res.data.data.nonce;
    }
  } catch (err) {
    // Session may not exist yet
  }

  // Fallback to cached nonce in sessionStorage
  return sessionStorage.getItem('ctfd_csrf_token') || '';
};

// Request interceptor to automatically attach CSRF-Token to mutative requests
api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      config.headers['CSRF-Token'] = csrfToken;
    }
  }
  return config;
});

// Mock F1 CTF Data for offline/demo/testing mode
const MOCK_USER = {
  id: 44,
  name: 'Sir Lewis Hamilton',
  team: 'Mercedes-AMG Petronas',
  email: 'hamilton44@mercedes-f1.com',
  score: 350,
  place: '3rd',
  superLicence: 'FIA-F1-HAM-44',
  carNumber: '44',
};

const MOCK_CHALLENGES = [
  {
    id: 1,
    name: 'R1: Telemetry Cipher',
    category: 'Round 1: Intercept & Trivia',
    description: 'An intercepted hexadecimal payload was logged right before the system went offline.\n\nConvert the hex values below into ASCII characters to recover the active Radio Signal Tag:\n`[ 0x52 ] [ 0x53 ] [ 0x53 ]`\n\nASCII Reference:\n0x41 = A | 0x42 = B | 0x43 = C | 0x52 = R | 0x53 = S | 0x54 = T\n\nOutput: Token 1 (Word Tag)',
    value: 100,
    solved_by_me: false,
    solves: 42,
    type: 'standard',
    tireCompound: 'HARD',
    order: 1,
    sector: 'Sector 1: Radio Decrypt',
    tags: ['Hex', 'ASCII', 'Token 1'],
  },
  {
    id: 2,
    name: 'R1: Pit Wall Trivia',
    category: 'Round 1: Intercept & Trivia',
    description: 'Answer the following official F1 questions. Combine both numeric answers directly without spaces or punctuation to unlock Token 2:\n\n1. How many total World Constructors\' Championships has Scuderia Ferrari won in Formula 1 history?\n2. What is Max Verstappen’s official permanent racing driver number?\n\nOutput: Token 2 (Joined Number String)',
    value: 100,
    solved_by_me: false,
    solves: 35,
    type: 'standard',
    tireCompound: 'HARD',
    order: 2,
    sector: 'Sector 1: Pit Trivia',
    tags: ['Trivia', 'F1 History', 'Token 2'],
  },
  {
    id: 3,
    name: 'R2: Telemetry Bug Line',
    category: 'Round 2: Telemetry Bug',
    description: 'Below is the telemetry checking script running on our main pit server. Execution halted due to a bug.\n\n```python\nLine 1 : # Telemetry Diagnostic Script v2.4\nLine 2 : # Checks sensor array outputs prior to pit release\nLine 3 :\nLine 4 : drivers = ["VER", "HAM", "LEC", "NOR"]\nLine 5 : telemetry_status = {"VER": 100, "HAM": 98, "LEC": 0, "NOR": 95}\nLine 6 : for i in range(len(drivers)):\nLine 7 :     if telemetry_status[drivers[i]] = 100:\nLine 8 :         print(f"Driver {drivers[i]}: MGU-K Telemetry Nominal")\nLine 9 :     else:\nLine 10:         print(f"Driver {drivers[i]}: Telemetry Warning")\n```\n\nInspect the script to find the line number where the bug occurs.\nOutput: Token 3 (Line Number)',
    value: 150,
    solved_by_me: false,
    solves: 28,
    type: 'standard',
    tireCompound: 'MEDIUM',
    order: 3,
    sector: 'Sector 2: Script Debug',
    tags: ['Python', 'Syntax', 'Token 3'],
  },
  {
    id: 4,
    name: 'R2: Error Classification Tag',
    category: 'Round 2: Telemetry Bug',
    description: 'Match the bug found on Line 7 with the corresponding 3-letter classification tag:\n\n- `SYN` : Syntax Error (e.g., assignment = in conditional statement)\n- `IND` : Index Error (Sequence index out of range)\n- `TYP` : Type Error (Incompatible data type operation)\n- `KEY` : Key Error (Mapping key not found in dictionary)\n\nOutput: Token 4 (3-Letter Classification Tag)',
    value: 150,
    solved_by_me: false,
    solves: 24,
    type: 'standard',
    tireCompound: 'MEDIUM',
    order: 4,
    sector: 'Sector 2: Error Tag',
    tags: ['Python', 'Exception', 'Token 4'],
  },
  {
    id: 5,
    name: 'R3: Car Diagnostic Spec',
    category: 'Round 3: Diagnostic Specs',
    description: 'Read the spec sheet below to identify the constructor/engine supplier code from the reference table:\n\nPit Bay Diagnostic Spec Sheet (Car #16):\n- Power Unit: Italian 1.6L V6 Turbo Hybrid engine, manufactured in Maranello, Italy\n- Tyre Strategy: Currently fitted with yellow-banded Pirelli Medium compound tires\n- Aero Setup: DRS-enabled rear wing tuned for high-speed overtake efficiency\n\nENGINE / CHASSIS LOOKUP TABLE:\n- Red Bull Racing: `RB`\n- Mercedes-AMG Petronas: `MGP`\n- Scuderia Ferrari: `SF`\n- McLaren F1 Team: `MCL`\n\nOutput: Token 5 (Chassis Code)',
    value: 200,
    solved_by_me: false,
    solves: 18,
    type: 'standard',
    tireCompound: 'SOFT',
    order: 5,
    sector: 'Sector 3: Car Spec',
    tags: ['Hardware', 'Maranello', 'Token 5'],
  },
  {
    id: 6,
    name: 'R4: Master Pit Release Passkey',
    category: 'Round 4: Master Hash',
    description: 'During Lap 45, the pit-release system was disabled. The car is forced to pit in 30 minutes!\n\nRestore telemetry and issue automated pit release by combining all 5 tokens using the Pit Terminal Assembly Formula:\n\nMASTER PASSKEY = Token 1 + Token 4 + Token 3 + Token 5 + Token 2\n\n[ Token 1: Word ] + [ Token 4: Error ] + [ Token 3: Line # ] + [ Token 5: Spec ] + [ Token 2: Trivia ]',
    value: 500,
    solved_by_me: false,
    solves: 6,
    type: 'standard',
    tireCompound: 'WET',
    order: 6,
    sector: 'Finish Line: Pit Override',
    tags: ['Escape Room', 'Passkey', 'Grand Finale'],
  },
];

const MOCK_SCOREBOARD = [
  {
    pos: 1,
    id: 1,
    name: 'Max Verstappen',
    team: 'Oracle Red Bull Racing',
    carNumber: '1',
    score: 550,
    solves: 4,
    gap: 'LEADER',
    lastSolve: '14:22:04',
    fastestLap: true,
    liveryColor: '#1E41FF',
  },
  {
    pos: 2,
    id: 16,
    name: 'Charles Leclerc',
    team: 'Scuderia Ferrari HP',
    carNumber: '16',
    score: 450,
    solves: 3,
    gap: '+100 PTS',
    lastSolve: '14:31:18',
    fastestLap: false,
    liveryColor: '#E80020',
  },
  {
    pos: 3,
    id: 44,
    name: 'Lewis Hamilton',
    team: 'Mercedes-AMG Petronas',
    carNumber: '44',
    score: 350,
    solves: 2,
    gap: '+200 PTS',
    lastSolve: '14:38:50',
    fastestLap: false,
    liveryColor: '#00D2BE',
  },
  {
    pos: 4,
    id: 4,
    name: 'Lando Norris',
    team: 'McLaren Formula 1',
    carNumber: '4',
    score: 250,
    solves: 2,
    gap: '+300 PTS',
    lastSolve: '14:45:12',
    fastestLap: false,
    liveryColor: '#FF8000',
  },
  {
    pos: 5,
    id: 14,
    name: 'Fernando Alonso',
    team: 'Aston Martin Aramco',
    carNumber: '14',
    score: 150,
    solves: 1,
    gap: '+400 PTS',
    lastSolve: '14:52:03',
    fastestLap: false,
    liveryColor: '#229971',
  },
  {
    pos: 6,
    id: 81,
    name: 'Oscar Piastri',
    team: 'McLaren Formula 1',
    carNumber: '81',
    score: 100,
    solves: 1,
    gap: '+450 PTS',
    lastSolve: '14:55:40',
    fastestLap: false,
    liveryColor: '#FF8000',
  },
  {
    pos: 7,
    id: 63,
    name: 'George Russell',
    team: 'Mercedes-AMG Petronas',
    carNumber: '63',
    score: 100,
    solves: 1,
    gap: '+450 PTS',
    lastSolve: '15:02:11',
    fastestLap: false,
    liveryColor: '#00D2BE',
  },
];

// Helper to determine tire compound from challenge difficulty/points
const getTireCompound = (value) => {
  if (value <= 100) return 'HARD';
  if (value <= 200) return 'MEDIUM';
  if (value <= 350) return 'SOFT';
  return 'WET';
};

export const ctfdApi = {
  /**
   * Helper to fetch CSRF Nonce token
   */
  async getCsrfToken() {
    return await getCsrfToken();
  },

  /**
   * Driver Login (Garage Entry)
   * Connects to CTFd /login with session cookie handling
   */
  async login(username, password) {
    try {
      const csrf = await getCsrfToken();
      const params = new URLSearchParams();
      params.append('name', username);
      params.append('password', password);
      if (csrf) params.append('nonce', csrf);
      params.append('_submit', 'Submit');

      const response = await api.post('/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Verify session with current user endpoint
      const user = await this.getCurrentUser();
      localStorage.setItem('f1_active_user', JSON.stringify(user));
      return { success: true, data: user };
    } catch (error) {
      console.warn('[CTFd API] Remote login failed, using local session fallback:', error.message);
      // Demo/Fallback driver session
      const fallbackUser = {
        ...MOCK_USER,
        name: username || 'Rookie Driver',
        carNumber: '77',
      };
      localStorage.setItem('f1_active_user', JSON.stringify(fallbackUser));
      return { success: true, data: fallbackUser, isDemo: true };
    }
  },

  /**
   * Rookie Registration
   * Connects to CTFd /register
   */
  async register(username, email, password) {
    try {
      const csrf = await getCsrfToken();
      const params = new URLSearchParams();
      params.append('name', username);
      params.append('email', email);
      params.append('password', password);
      if (csrf) params.append('nonce', csrf);
      params.append('_submit', 'Submit');

      const response = await api.post('/register', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const user = await this.getCurrentUser();
      localStorage.setItem('f1_active_user', JSON.stringify(user));
      return { success: true, data: user };
    } catch (error) {
      console.warn('[CTFd API] Remote register failed, using local session fallback:', error.message);
      const fallbackUser = {
        id: Math.floor(Math.random() * 90) + 10,
        name: username,
        email: email,
        team: 'Privateer Racing',
        score: 0,
        place: 'Unranked',
        superLicence: `FIA-F1-${username.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
        carNumber: `${Math.floor(Math.random() * 98 + 1)}`,
      };
      localStorage.setItem('f1_active_user', JSON.stringify(fallbackUser));
      return { success: true, data: fallbackUser, isDemo: true };
    }
  },

  /**
   * Driver Logout
   */
  async logout() {
    try {
      await api.get('/logout');
    } catch (error) {
      console.warn('[CTFd API] Remote logout failed:', error.message);
    } finally {
      localStorage.removeItem('f1_active_user');
      sessionStorage.removeItem('ctfd_csrf_token');
      return { success: true };
    }
  },

  /**
   * Get Current Authenticated Driver / User
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/api/v1/users/me');
      if (response.data && response.data.success) {
        const u = response.data.data;
        const mappedUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          team: u.team_id ? `Team #${u.team_id}` : 'Scuderia Driver',
          score: u.score || 0,
          place: u.place || 'P1',
          superLicence: `FIA-F1-${(u.name || 'DRV').substring(0, 3).toUpperCase()}-${u.id}`,
          carNumber: `${(u.id % 99) || 44}`,
        };
        localStorage.setItem('f1_active_user', JSON.stringify(mappedUser));
        return mappedUser;
      }
    } catch (error) {
      // Return cached user or mock user
      const stored = localStorage.getItem('f1_active_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return MOCK_USER;
    }
    return MOCK_USER;
  },

  /**
   * Get All Pit Stop Challenges
   */
  async getChallenges() {
    try {
      const response = await api.get('/api/v1/challenges');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const liveChallenges = response.data.data.map((c, index) => ({
          id: c.id,
          name: c.name,
          category: c.category || `Pit Stop ${index + 1}`,
          value: c.value,
          solved_by_me: Boolean(c.solved_by_me),
          solves: c.solves || 0,
          type: c.type || 'standard',
          tireCompound: getTireCompound(c.value),
          order: index + 1,
          sector: `Sector ${(index % 3) + 1}`,
          tags: c.tags || ['F1', 'CTF'],
          description: c.description || 'Access challenge details to review telemetry.',
        }));

        // Merge with local solved flags if any stored locally
        const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
        return liveChallenges.map(c => ({
          ...c,
          solved_by_me: c.solved_by_me || Boolean(solvedMap[c.id]),
        }));
      }
    } catch (error) {
      console.warn('[CTFd API] Failed to fetch live challenges, using F1 escape room presets:', error.message);
    }

    // Fallback: Return enriched mock challenges with persistent local solves
    const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
    return MOCK_CHALLENGES.map(c => ({
      ...c,
      solved_by_me: Boolean(solvedMap[c.id] ?? c.solved_by_me),
    }));
  },

  /**
   * Get Single Pit Stop Challenge Details
   */
  async getChallenge(id) {
    try {
      const response = await api.get(`/api/v1/challenges/${id}`);
      if (response.data && response.data.success) {
        const c = response.data.data;
        const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
        return {
          id: c.id,
          name: c.name,
          category: c.category || 'Pit Stop Challenge',
          description: c.description,
          value: c.value,
          solved_by_me: Boolean(c.solved_by_me || solvedMap[c.id]),
          solves: c.solves || 0,
          type: c.type,
          files: c.files || [],
          hints: c.hints || [],
          tags: c.tags || ['Telemetry'],
          tireCompound: getTireCompound(c.value),
        };
      }
    } catch (error) {
      console.warn(`[CTFd API] Failed to fetch challenge #${id}, using mock:`, error.message);
    }

    const mock = MOCK_CHALLENGES.find(c => c.id === Number(id)) || MOCK_CHALLENGES[0];
    const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
    return {
      ...mock,
      solved_by_me: Boolean(solvedMap[mock.id] ?? mock.solved_by_me),
    };
  },

  /**
   * Submit Flag for a Pit Stop Challenge
   * Endpoint: /api/v1/challenges/attempt
   * Body: { challenge_id, submission }
   */
  async submitFlag(challengeId, flag) {
    try {
      const response = await api.post('/api/v1/challenges/attempt', {
        challenge_id: Number(challengeId),
        submission: flag.trim(),
      });

      if (response.data && response.data.success) {
        const status = response.data.data.status;
        const isCorrect = status === 'correct';
        const isAlreadySolved = status === 'already_solved';

        if (isCorrect || isAlreadySolved) {
          // Record locally
          const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
          solvedMap[challengeId] = true;
          localStorage.setItem('f1_local_solves', JSON.stringify(solvedMap));
        }

        return {
          success: true,
          status: status, // 'correct', 'incorrect', 'already_solved', 'paused'
          message: response.data.data.message || (isCorrect ? 'PURPLE SECTOR! Flag is verified.' : 'Yellow flag: Incorrect submission.'),
        };
      }
    } catch (error) {
      console.warn('[CTFd API] Flag attempt submission error, running validation simulator:', error.message);
    }

    // Simulated flag validation for escape room demo (accepts common flag formats or 'F1{...}')
    const trimmed = flag.trim().toUpperCase();
    const isMockCorrect = 
      trimmed === 'RSS' ||
      trimmed === '161' ||
      trimmed === '7' ||
      trimmed === 'SYN' ||
      trimmed === 'SF' ||
      trimmed === 'RSSSYN7SF161' ||
      trimmed.startsWith('FLAG{') ||
      trimmed.startsWith('F1{');

    if (isMockCorrect) {
      const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
      solvedMap[challengeId] = true;
      localStorage.setItem('f1_local_solves', JSON.stringify(solvedMap));

      // Increase mock user points
      const user = JSON.parse(localStorage.getItem('f1_active_user') || JSON.stringify(MOCK_USER));
      user.score = (user.score || 0) + 150;
      localStorage.setItem('f1_active_user', JSON.stringify(user));

      return {
        success: true,
        status: 'correct',
        message: 'PURPLE SECTOR! Flag verified! Pit stop service complete.',
      };
    } else {
      return {
        success: false,
        status: 'incorrect',
        message: 'YELLOW FLAG! Telemetry check failed: Invalid flag sequence.',
      };
    }
  },

  /**
   * Get Race Standings / Scoreboard
   */
  async getScoreboard() {
    const activeUser = JSON.parse(localStorage.getItem('f1_active_user') || JSON.stringify(MOCK_USER));
    const solvedMap = JSON.parse(localStorage.getItem('f1_local_solves') || '{}');
    const localSolveCount = Object.keys(solvedMap).length;
    const localPoints = localSolveCount * 100;

    try {
      const response = await api.get('/api/v1/scoreboard');
      if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data.map((entry, index) => ({
          pos: index + 1,
          id: entry.account_id || entry.id,
          name: entry.name,
          team: entry.team || `Constructor #${entry.account_id || index + 1}`,
          carNumber: `${(entry.account_id % 99) || index + 1}`,
          score: entry.score,
          solves: entry.solves ? entry.solves.length : 0,
          gap: index === 0 ? 'LEADER' : `-${response.data.data[0].score - entry.score} PTS`,
          lastSolve: 'Recently',
          fastestLap: index === 0,
          liveryColor: index === 0 ? '#1E41FF' : index === 1 ? '#E80020' : '#00D2BE',
        }));
      }
    } catch (error) {
      console.warn('[CTFd API] Live scoreboard query failed, using dynamic telemetry grid:', error.message);
    }

    // Dynamic grid: Display current driver/team alongside grid competitors
    const currentDriver = {
      pos: 1,
      id: activeUser.id || 99,
      name: activeUser.name || 'Emergency Pit Crew',
      team: activeUser.team || 'Scuderia Mission Winnow',
      carNumber: activeUser.carNumber || '16',
      score: localPoints > 0 ? localPoints : (activeUser.score || 200),
      solves: localSolveCount > 0 ? localSolveCount : 2,
      gap: 'LEADER',
      lastSolve: 'Just now',
      fastestLap: true,
      liveryColor: '#E80020',
    };

    const competitor1 = {
      pos: 2,
      id: 1,
      name: 'Oracle Red Bull Racing',
      team: 'Red Bull Racing Honda',
      carNumber: '1',
      score: Math.max(0, currentDriver.score - 50),
      solves: Math.max(0, currentDriver.solves - 1),
      gap: '+50 PTS',
      lastSolve: '1 min ago',
      fastestLap: false,
      liveryColor: '#1E41FF',
    };

    const competitor2 = {
      pos: 3,
      id: 4,
      name: 'McLaren F1 Team',
      team: 'McLaren Mercedes',
      carNumber: '4',
      score: Math.max(0, currentDriver.score - 100),
      solves: Math.max(0, currentDriver.solves - 1),
      gap: '+100 PTS',
      lastSolve: '3 mins ago',
      fastestLap: false,
      liveryColor: '#FF8000',
    };

    const competitor3 = {
      pos: 4,
      id: 63,
      name: 'Mercedes-AMG Petronas',
      team: 'Mercedes-AMG F1',
      carNumber: '63',
      score: 50,
      solves: 0,
      gap: `+${currentDriver.score - 50} PTS`,
      lastSolve: '5 mins ago',
      fastestLap: false,
      liveryColor: '#00D2BE',
    };

    return [currentDriver, competitor1, competitor2, competitor3];
  },
};

export default ctfdApi;
