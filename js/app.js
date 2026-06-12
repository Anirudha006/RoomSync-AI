/**
 * RoomSync AI - Main Application Controller (Hybrid Backend with LocalStorage Fallback)
 * Handles SPA navigation, registration, matching algorithm, SVG chart engines,
 * ER diagram connectors, and local storage state persistence.
 */

// ==========================================
// 1. CONFIGURATION & STATE INITIALIZATION
// ==========================================
const API_URL = 'api/api.php';
const STORAGE_KEYS = {
  STUDENTS: 'roomsync_students',
  PREFERENCES: 'roomsync_preferences',
  HOBBIES: 'roomsync_hobbies',
  MATCHES: 'roomsync_matches',
  ACTIVE_USER: 'roomsync_active_user'
};

const ALL_HOBBIES = ['Gaming', 'Coding', 'Reading', 'Sports', 'Music', 'Movies', 'Photography', 'Fitness'];

// Flag to toggle client-side local storage fallback
let useLocalStorageFallback = false;

// Mock database structures (used as local storage seed data on fallback mode)
const MOCK_STUDENTS = [
  { student_id: 'S202601', name: 'Aarav Sharma', gender: 'Male', branch: 'Computer Science', year: '2nd Year', email: 'aarav.sharma@hostel.edu' },
  { student_id: 'S202602', name: 'Kavita Verma', gender: 'Female', branch: 'Electronics', year: '3rd Year', email: 'kavita.verma@hostel.edu' },
  { student_id: 'S202603', name: 'Rahul Nair', gender: 'Male', branch: 'Mechanical', year: '2nd Year', email: 'rahul.nair@hostel.edu' },
  { student_id: 'S202604', name: 'Meera Pillai', gender: 'Female', branch: 'Biotech', year: '1st Year', email: 'meera.pillai@hostel.edu' },
  { student_id: 'S202605', name: 'Siddharth Patel', gender: 'Male', branch: 'Civil Engineering', year: '4th Year', email: 'siddharth.patel@hostel.edu' },
  { student_id: 'S202606', name: 'Anjali Das', gender: 'Female', branch: 'Information Tech', year: '3rd Year', email: 'anjali.das@hostel.edu' },
  { student_id: 'S202607', name: 'Rohan Gupta', gender: 'Male', branch: 'Computer Science', year: '2nd Year', email: 'rohan.gupta@hostel.edu' },
  { student_id: 'S202608', name: 'Neha Roy', gender: 'Female', branch: 'Electrical', year: '1st Year', email: 'neha.roy@hostel.edu' },
  { student_id: 'S202609', name: 'Vikram Singh', gender: 'Male', branch: 'Chemical', year: '3rd Year', email: 'vikram.singh@hostel.edu' },
  { student_id: 'S202610', name: 'Tanvi Sen', gender: 'Female', branch: 'Architecture', year: '2nd Year', email: 'tanvi.sen@hostel.edu' }
];

const MOCK_PREFERENCES = [
  { pref_id: 1, student_id: 'S202601', sleep_schedule: 'Late Sleeper', study_style: 'Flexible', cleanliness: 'Average', social_pref: 'Extrovert', room_environment: 'Social' },
  { pref_id: 2, student_id: 'S202602', sleep_schedule: 'Early Sleeper', study_style: 'Silent Study', cleanliness: 'Very Clean', social_pref: 'Introvert', room_environment: 'Quiet' },
  { pref_id: 3, student_id: 'S202603', sleep_schedule: 'Late Sleeper', study_style: 'Group Study', cleanliness: 'Relaxed', social_pref: 'Extrovert', room_environment: 'Social' },
  { pref_id: 4, student_id: 'S202604', sleep_schedule: 'Early Sleeper', study_style: 'Silent Study', cleanliness: 'Very Clean', social_pref: 'Introvert', room_environment: 'Quiet' },
  { pref_id: 5, student_id: 'S202605', sleep_schedule: 'Early Sleeper', study_style: 'Flexible', cleanliness: 'Average', social_pref: 'Balanced', room_environment: 'Moderate' },
  { pref_id: 6, student_id: 'S202606', sleep_schedule: 'Late Sleeper', study_style: 'Group Study', cleanliness: 'Relaxed', social_pref: 'Extrovert', room_environment: 'Social' },
  { pref_id: 7, student_id: 'S202607', sleep_schedule: 'Early Sleeper', study_style: 'Silent Study', cleanliness: 'Very Clean', social_pref: 'Balanced', room_environment: 'Quiet' },
  { pref_id: 8, student_id: 'S202608', sleep_schedule: 'Late Sleeper', study_style: 'Flexible', cleanliness: 'Average', social_pref: 'Balanced', room_environment: 'Moderate' },
  { pref_id: 9, student_id: 'S202609', sleep_schedule: 'Late Sleeper', study_style: 'Group Study', cleanliness: 'Average', social_pref: 'Extrovert', room_environment: 'Social' },
  { pref_id: 10, student_id: 'S202610', sleep_schedule: 'Early Sleeper', study_style: 'Flexible', cleanliness: 'Average', social_pref: 'Balanced', room_environment: 'Moderate' }
];

const MOCK_HOBBIES = [
  { hobby_id: 1, student_id: 'S202601', hobby_name: 'Gaming' },
  { hobby_id: 2, student_id: 'S202601', hobby_name: 'Coding' },
  { hobby_id: 3, student_id: 'S202601', hobby_name: 'Music' },
  { hobby_id: 4, student_id: 'S202602', hobby_name: 'Reading' },
  { hobby_id: 5, student_id: 'S202602', hobby_name: 'Photography' },
  { hobby_id: 6, student_id: 'S202602', hobby_name: 'Fitness' },
  { hobby_id: 7, student_id: 'S202603', hobby_name: 'Gaming' },
  { hobby_id: 8, student_id: 'S202603', hobby_name: 'Sports' },
  { hobby_id: 9, student_id: 'S202603', hobby_name: 'Movies' },
  { hobby_id: 10, student_id: 'S202604', hobby_name: 'Reading' },
  { hobby_id: 11, student_id: 'S202604', hobby_name: 'Coding' },
  { hobby_id: 12, student_id: 'S202604', hobby_name: 'Movies' },
  { hobby_id: 13, student_id: 'S202605', hobby_name: 'Sports' },
  { hobby_id: 14, student_id: 'S202605', hobby_name: 'Movies' },
  { hobby_id: 15, student_id: 'S202605', hobby_name: 'Photography' },
  { hobby_id: 16, student_id: 'S202606', hobby_name: 'Gaming' },
  { hobby_id: 17, student_id: 'S202606', hobby_name: 'Music' },
  { hobby_id: 18, student_id: 'S202606', hobby_name: 'Movies' },
  { hobby_id: 19, student_id: 'S202607', hobby_name: 'Coding' },
  { hobby_id: 20, student_id: 'S202607', hobby_name: 'Reading' },
  { hobby_id: 21, student_id: 'S202607', hobby_name: 'Fitness' },
  { hobby_id: 22, student_id: 'S202608', hobby_name: 'Music' },
  { hobby_id: 23, student_id: 'S202608', hobby_name: 'Photography' },
  { hobby_id: 24, student_id: 'S202608', hobby_name: 'Fitness' },
  { hobby_id: 25, student_id: 'S202609', hobby_name: 'Gaming' },
  { hobby_id: 26, student_id: 'S202609', hobby_name: 'Sports' },
  { hobby_id: 27, student_id: 'S202609', hobby_name: 'Music' },
  { hobby_id: 28, student_id: 'S202610', hobby_name: 'Reading' },
  { hobby_id: 29, student_id: 'S202610', hobby_name: 'Music' },
  { hobby_id: 30, student_id: 'S202610', hobby_name: 'Photography' }
];

const MOCK_MATCHES = [
  { match_id: 1, student_a_id: 'S202601', student_b_id: 'S202603', compatibility_score: 91, match_date: '2026-06-01T10:00:00Z' },
  { match_id: 2, student_a_id: 'S202602', student_b_id: 'S202604', compatibility_score: 97, match_date: '2026-06-02T11:30:00Z' },
  { match_id: 3, student_a_id: 'S202605', student_b_id: 'S202607', compatibility_score: 84, match_date: '2026-06-03T09:15:00Z' },
  { match_id: 4, student_a_id: 'S202606', student_b_id: 'S202608', compatibility_score: 82, match_date: '2026-06-03T14:45:00Z' },
  { match_id: 5, student_a_id: 'S202609', student_b_id: 'S202601', compatibility_score: 88, match_date: '2026-06-04T08:20:00Z' }
];

function updateDbStatusBadge() {
  const badge = document.getElementById('db-status-badge');
  const banner = document.getElementById('db-warning-banner');
  if (!badge) return;
  if (useLocalStorageFallback) {
    badge.textContent = 'LOCAL CACHE';
    badge.style.color = 'var(--gold)';
    badge.style.textShadow = '0 0 5px var(--gold-glow)';
    if (banner) banner.style.display = 'flex';
  } else {
    badge.textContent = 'MYSQL DATABASE';
    badge.style.color = 'var(--cyan)';
    badge.style.textShadow = '0 0 5px var(--cyan-glow)';
    if (banner) banner.style.display = 'none';
  }
}

// Asynchronous Request router (attempts PHP endpoint, falls back to client-side localStorage on failure)
async function apiRequest(action, method = 'GET', data = null) {
  if (useLocalStorageFallback) {
    updateDbStatusBadge();
    return handleLocalStorageRequest(action, method, data);
  }

  const url = `${API_URL}?action=${action}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const result = await response.json();
    useLocalStorageFallback = false;
    updateDbStatusBadge();
    return result;
  } catch (error) {
    console.warn(`[RoomSync AI] PHP backend unavailable. Falling back to local browser storage. Detail:`, error.message);
    useLocalStorageFallback = true;
    updateDbStatusBadge();
    initLocalStorageDatabase();
    return handleLocalStorageRequest(action, method, data);
  }
}

function getActiveUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_USER)) || null;
}

// ==========================================
// 2. CLIENT-SIDE DATABASE FALLBACK DRIVER
// ==========================================
function initLocalStorageDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(MOCK_PREFERENCES));
    localStorage.setItem(STORAGE_KEYS.HOBBIES, JSON.stringify(MOCK_HOBBIES));
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(MOCK_MATCHES));
  }
}

function getLocalItem(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setLocalItem(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function handleLocalStorageRequest(action, method, data) {
  initLocalStorageDatabase();
  
  if (action === 'register' && method === 'POST') {
    const students = getLocalItem(STORAGE_KEYS.STUDENTS);
    const existingIndex = students.findIndex(s => s.student_id === data.student_id);
    if (existingIndex !== -1) students[existingIndex] = data;
    else students.push(data);
    setLocalItem(STORAGE_KEYS.STUDENTS, students);
    return { success: true };
  }

  if (action === 'save_preferences' && method === 'POST') {
    const preferences = getLocalItem(STORAGE_KEYS.PREFERENCES);
    const hobbies = getLocalItem(STORAGE_KEYS.HOBBIES);
    
    // Save preferences
    const newPref = {
      pref_id: Date.now(),
      student_id: data.student_id,
      sleep_schedule: data.sleep_schedule,
      study_style: data.study_style,
      cleanliness: data.cleanliness,
      social_pref: data.social_pref,
      room_environment: data.room_environment
    };
    const prefIndex = preferences.findIndex(p => p.student_id === data.student_id);
    if (prefIndex !== -1) preferences[prefIndex] = newPref;
    else preferences.push(newPref);
    setLocalItem(STORAGE_KEYS.PREFERENCES, preferences);

    // Save hobbies
    const filteredHobbies = hobbies.filter(h => h.student_id !== data.student_id);
    data.hobbies.forEach((hobby, index) => {
      filteredHobbies.push({
        hobby_id: Date.now() + index,
        student_id: data.student_id,
        hobby_name: hobby
      });
    });
    setLocalItem(STORAGE_KEYS.HOBBIES, filteredHobbies);
    return { success: true };
  }

  if (action.startsWith('get_match')) {
    const userId = action.split('student_id=')[1];
    return executeClientSideMatch(userId);
  }

  if (action === 'get_admin_stats') {
    const students = getLocalItem(STORAGE_KEYS.STUDENTS);
    const preferences = getLocalItem(STORAGE_KEYS.PREFERENCES);
    const hobbies = getLocalItem(STORAGE_KEYS.HOBBIES);
    const matches = getLocalItem(STORAGE_KEYS.MATCHES);

    const cleanlinessSplit = [
      { cleanliness: 'Very Clean', count: preferences.filter(p => p.cleanliness === 'Very Clean').length },
      { cleanliness: 'Average', count: preferences.filter(p => p.cleanliness === 'Average').length },
      { cleanliness: 'Relaxed', count: preferences.filter(p => p.cleanliness === 'Relaxed').length }
    ];

    const sleepSplit = [
      { sleep_schedule: 'Early Sleeper', count: preferences.filter(p => p.sleep_schedule === 'Early Sleeper').length },
      { sleep_schedule: 'Late Sleeper', count: preferences.filter(p => p.sleep_schedule === 'Late Sleeper').length }
    ];

    const hobbiesSplit = ALL_HOBBIES.map(hobby => {
      return { hobby_name: hobby, count: hobbies.filter(h => h.hobby_name === hobby).length };
    });

    const totalScore = matches.reduce((acc, m) => acc + m.compatibility_score, 0);
    const avgScore = matches.length ? Math.round(totalScore / matches.length) : 0;
    const highMatches = matches.filter(m => m.compatibility_score >= 75).length;

    return {
      stats: {
        total_students: students.length,
        total_matches: matches.length,
        allocated_rooms: highMatches,
        avg_score: avgScore
      },
      charts: {
        cleanliness: cleanlinessSplit,
        hobbies: hobbiesSplit,
        sleep: sleepSplit,
        scores: matches.map(m => m.compatibility_score)
      }
    };
  }

  if (action === 'get_erd_data') {
    return {
      students: getLocalItem(STORAGE_KEYS.STUDENTS),
      preferences: getLocalItem(STORAGE_KEYS.PREFERENCES),
      hobbies: getLocalItem(STORAGE_KEYS.HOBBIES),
      matches: getLocalItem(STORAGE_KEYS.MATCHES)
    };
  }

  return { error: 'Action not found' };
}

// Client-side Match Calculation
function executeClientSideMatch(userId) {
  const students = getLocalItem(STORAGE_KEYS.STUDENTS);
  const preferences = getLocalItem(STORAGE_KEYS.PREFERENCES);
  const hobbies = getLocalItem(STORAGE_KEYS.HOBBIES);
  const matches = getLocalItem(STORAGE_KEYS.MATCHES);

  const activeStudent = students.find(s => s.student_id === userId);
  if (!activeStudent) return { error: 'User not found' };

  const userPrefs = preferences.find(p => p.student_id === userId);
  const userHobbies = hobbies.filter(h => h.student_id === userId).map(h => h.hobby_name);

  if (!userPrefs) return { error: 'Prefs not found' };

  let bestMatch = null;
  let bestScore = -1;

  const candidates = students.filter(s => s.student_id !== userId && s.gender === activeStudent.gender);
  const list = candidates.length > 0 ? candidates : students.filter(s => s.student_id !== userId);

  list.forEach(candidate => {
    const candPrefs = preferences.find(p => p.student_id === candidate.student_id);
    if (!candPrefs) return;

    const candHobbies = hobbies.filter(h => h.student_id === candidate.student_id).map(h => h.hobby_name);

    const sleepScore = userPrefs.sleep_schedule === candPrefs.sleep_schedule ? 100 : 20;
    
    let cleanScore = 70;
    if (userPrefs.cleanliness === candPrefs.cleanliness) cleanScore = 100;
    else if ((userPrefs.cleanliness === 'Very Clean' && candPrefs.cleanliness === 'Relaxed') || (userPrefs.cleanliness === 'Relaxed' && candPrefs.cleanliness === 'Very Clean')) cleanScore = 20;

    let studyScore = 50;
    if (userPrefs.study_style === candPrefs.study_style) studyScore = 100;
    else if ((userPrefs.study_style === 'Silent Study' && candPrefs.study_style === 'Group Study') || (userPrefs.study_style === 'Group Study' && candPrefs.study_style === 'Silent Study')) studyScore = 10;
    else if (userPrefs.study_style === 'Flexible' || candPrefs.study_style === 'Flexible') studyScore = 75;

    let socialScore = 70;
    if (userPrefs.social_pref === candPrefs.social_pref) socialScore = 100;
    else if ((userPrefs.social_pref === 'Introvert' && candPrefs.social_pref === 'Extrovert') || (userPrefs.social_pref === 'Extrovert' && candPrefs.social_pref === 'Introvert')) socialScore = 20;

    let hobbyScore = 0;
    if (userHobbies.length && candHobbies.length) {
      const intersect = userHobbies.filter(h => candHobbies.includes(h));
      const union = new Set([...userHobbies, ...candHobbies]);
      hobbyScore = Math.round((intersect.length / union.size) * 100);
    }

    const totalScore = Math.round(
      (sleepScore * 0.25) +
      (cleanScore * 0.25) +
      (studyScore * 0.20) +
      (socialScore * 0.15) +
      (hobbyScore * 0.15)
    );

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = {
        candidate,
        score: totalScore,
        breakdown: { sleep: sleepScore, clean: cleanScore, study: studyScore, social: socialScore, hobby: hobbyScore }
      };
    }
  });

  if (bestMatch) {
    const newMatch = {
      match_id: Date.now(),
      student_a_id: userId,
      student_b_id: bestMatch.candidate.student_id,
      compatibility_score: bestMatch.score,
      match_date: new Date().toISOString()
    };
    const filteredMatches = matches.filter(m => !(m.student_a_id === userId || m.student_b_id === userId));
    filteredMatches.push(newMatch);
    setLocalItem(STORAGE_KEYS.MATCHES, filteredMatches);

    return {
      student_a_id: userId,
      matchPartner: bestMatch.candidate,
      score: bestMatch.score,
      breakdown: bestMatch.breakdown
    };
  }

  return { error: 'No match found' };
}

// ==========================================
// 3. SPA NAVIGATION & DRAWER LAYOUTS
// ==========================================
function showView(viewId) {
  const container = document.getElementById('main-app-container');
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) targetSection.classList.add('active');

  document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNavItem = document.getElementById(`nav-${viewId}`);
  if (activeNavItem) activeNavItem.classList.add('active');

  if (viewId === 'landing') {
    container.classList.add('landing-active');
  } else {
    container.classList.remove('landing-active');
    updateSidebarProfileWidget();
  }

  if (viewId === 'results') {
    renderMatchResults();
  } else if (viewId === 'admin') {
    renderAdminDashboard();
  } else if (viewId === 'database') {
    setTimeout(drawERDiagramRelationships, 150);
  }

  document.getElementById('app-sidebar').classList.remove('open');
  document.querySelector('main').scrollTop = 0;
}

function enterApp(targetView) {
  const activeUser = getActiveUser();
  if (!activeUser && (targetView === 'preferences' || targetView === 'results')) {
    showView('register');
  } else {
    showView(targetView);
  }
}

function updateSidebarProfileWidget() {
  const activeUser = getActiveUser();
  const widget = document.getElementById('sidebar-profile-widget');
  const nameLabel = document.getElementById('sidebar-user-name');
  const idLabel = document.getElementById('sidebar-user-id');
  const avatarLabel = document.getElementById('sidebar-user-avatar');

  if (activeUser) {
    widget.style.display = 'flex';
    nameLabel.textContent = activeUser.name;
    idLabel.textContent = `ID: ${activeUser.student_id}`;
    const initials = activeUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    avatarLabel.textContent = initials;
  } else {
    widget.style.display = 'none';
  }
}

// ==========================================
// 4. REGISTRATION & PREFERENCE INTERACTION
// ==========================================
let tempRegistration = null;

async function handleRegistrationSubmit(event) {
  event.preventDefault();
  
  const student_id = document.getElementById('reg-student-id').value.trim();
  const name = document.getElementById('reg-name').value.trim();
  const gender = document.getElementById('reg-gender').value;
  const branch = document.getElementById('reg-branch').value.trim();
  const year = document.getElementById('reg-year').value;
  const email = document.getElementById('reg-email').value.trim();

  if (!student_id || !name || !gender || !branch || !year || !email) {
    alert("Please complete all registration fields.");
    return;
  }

  tempRegistration = { student_id, name, gender, branch, year, email };
  const res = await apiRequest('register', 'POST', tempRegistration);
  if (res.error) {
    alert("Registration failed: " + res.error);
    return;
  }
  showView('preferences');
}

function renderHobbiesChips() {
  const wrapper = document.getElementById('hobbies-chips-wrapper');
  wrapper.innerHTML = '';
  
  ALL_HOBBIES.forEach(hobby => {
    const label = document.createElement('label');
    label.className = 'chip-label';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'pref-hobbies';
    input.value = hobby;
    
    const content = document.createElement('div');
    content.className = 'chip-content';
    content.textContent = hobby;
    
    const plusIcon = document.createElement('span');
    plusIcon.innerHTML = '+';
    plusIcon.style.marginLeft = '4px';
    content.appendChild(plusIcon);

    label.appendChild(input);
    label.appendChild(content);
    wrapper.appendChild(label);
  });
}

async function handlePreferencesSubmit(event) {
  event.preventDefault();

  if (!tempRegistration) {
    const active = getActiveUser();
    if (active) tempRegistration = active;
    else {
      alert("Please register your basic profile details first.");
      showView('register');
      return;
    }
  }

  const sleep = document.querySelector('input[name="pref-sleep"]:checked').value;
  const study = document.querySelector('input[name="pref-study"]:checked').value;
  const cleanliness = document.querySelector('input[name="pref-clean"]:checked').value;
  const social = document.querySelector('input[name="pref-social"]:checked').value;
  const environment = document.querySelector('input[name="pref-environment"]:checked').value;
  
  const hobbyCheckboxes = document.querySelectorAll('input[name="pref-hobbies"]:checked');
  const selectedHobbies = Array.from(hobbyCheckboxes).map(cb => cb.value);

  if (selectedHobbies.length < 3) {
    alert("Please select at least 3 hobbies or interests.");
    return;
  }

  const prefPayload = {
    student_id: tempRegistration.student_id,
    sleep_schedule: sleep,
    study_style: study,
    cleanliness: cleanliness,
    social_pref: social,
    room_environment: environment,
    hobbies: selectedHobbies
  };

  const saveRes = await apiRequest('save_preferences', 'POST', prefPayload);
  if (saveRes.error) {
    alert("Failed to save preferences: " + saveRes.error);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(tempRegistration));

  const matchRes = await apiRequest(`get_match&student_id=${tempRegistration.student_id}`);
  if (matchRes.error) {
    alert("Matching calculation failed: " + matchRes.error);
    return;
  }

  localStorage.setItem('roomsync_active_match_breakdown', JSON.stringify(matchRes));
  showView('results');
}

// ==========================================
// 5. MATCH RESULTS RENDER & RADAR GRAPH
// ==========================================
async function renderMatchResults() {
  const activeUser = getActiveUser();
  if (!activeUser) {
    showView('register');
    return;
  }

  document.getElementById('res-user-name').textContent = activeUser.name;
  document.getElementById('res-user-id').textContent = `ID: ${activeUser.student_id}`;
  document.getElementById('res-user-branch').textContent = activeUser.branch;
  document.getElementById('res-user-year').textContent = activeUser.year;
  document.getElementById('res-user-avatar').textContent = activeUser.name.split(' ').map(n => n[0]).join('').toUpperCase();

  let matchData = JSON.parse(localStorage.getItem('roomsync_active_match_breakdown'));
  if (!matchData || matchData.student_a_id !== activeUser.student_id) {
    matchData = await apiRequest(`get_match&student_id=${activeUser.student_id}`);
    if (matchData && matchData.matchPartner) {
      localStorage.setItem('roomsync_active_match_breakdown', JSON.stringify(matchData));
    } else {
      showView('preferences');
      return;
    }
  }

  const partner = matchData.matchPartner;
  const score = matchData.score;
  const breakdown = matchData.breakdown;

  const circleOffset = 440 - (440 * score) / 100;
  const fillRing = document.getElementById('res-score-ring');
  fillRing.style.strokeDashoffset = circleOffset;
  
  if (score >= 80) {
    fillRing.style.stroke = 'var(--emerald)';
    document.getElementById('res-match-verdict').textContent = 'Highly Compatible';
    document.getElementById('res-match-verdict').style.color = 'var(--emerald)';
    document.getElementById('res-match-verdict').style.borderColor = 'rgba(34, 197, 94, 0.3)';
    document.getElementById('res-match-verdict').style.background = 'rgba(34, 197, 94, 0.15)';
  } else if (score >= 60) {
    fillRing.style.stroke = 'var(--gold)';
    document.getElementById('res-match-verdict').textContent = 'Moderate Match';
    document.getElementById('res-match-verdict').style.color = 'var(--gold)';
    document.getElementById('res-match-verdict').style.borderColor = 'rgba(251, 191, 36, 0.3)';
    document.getElementById('res-match-verdict').style.background = 'rgba(251, 191, 36, 0.15)';
  } else {
    fillRing.style.stroke = 'var(--danger)';
    document.getElementById('res-match-verdict').textContent = 'Low Synergy';
    document.getElementById('res-match-verdict').style.color = 'var(--danger)';
    document.getElementById('res-match-verdict').style.borderColor = 'rgba(239, 68, 68, 0.3)';
    document.getElementById('res-match-verdict').style.background = 'rgba(239, 68, 68, 0.15)';
  }

  let currentNum = 0;
  const scoreEl = document.getElementById('res-score-number');
  const scoreTimer = setInterval(() => {
    if (currentNum >= score) clearInterval(scoreTimer);
    else {
      currentNum++;
      scoreEl.textContent = currentNum;
    }
  }, 10);

  document.getElementById('res-match-name').textContent = partner.name;
  document.getElementById('res-match-avatar').textContent = partner.name.split(' ').map(n => n[0]).join('').toUpperCase();

  animateProgressBar('bar-fill-sleep', 'bar-val-sleep', breakdown.sleep);
  animateProgressBar('bar-fill-clean', 'bar-val-clean', breakdown.clean);
  animateProgressBar('bar-fill-study', 'bar-val-study', breakdown.study);
  animateProgressBar('bar-fill-social', 'bar-val-social', breakdown.social);
  animateProgressBar('bar-fill-hobby', 'bar-val-hobby', breakdown.hobby);

  const erd = await apiRequest('get_erd_data');
  if (erd && !erd.error) {
    const userPrefs = erd.preferences.find(p => p.student_id === activeUser.student_id);
    const partnerPrefs = erd.preferences.find(p => p.student_id === partner.student_id);
    if (userPrefs && partnerPrefs) {
      generateAIInsights(activeUser, partner, userPrefs, partnerPrefs, score);
    }
  }

  drawRadarGraph(breakdown);
}

function generateAIInsights(user, partner, userPrefs, partnerPrefs, score) {
  const insightTextEl = document.getElementById('res-insight-text');
  const conflictCard = document.getElementById('res-conflict-card');
  const conflictTextEl = document.getElementById('res-conflict-text');
  const roomTextEl = document.getElementById('res-room-text');

  let insight = '';
  if (score >= 85) {
    insight = `Excellent synergy! Both ${user.name.split(' ')[0]} and ${partner.name.split(' ')[0]} share matching study environments (${userPrefs.study_style}) and highly aligned routines. Minimal roommate frictions are expected, creating a strong potential for a cohesive, collaborative study room environment.`;
  } else if (score >= 65) {
    insight = `Good potential match. While you have slight deviations in study styles, your overlapping cleanliness preferences (${userPrefs.cleanliness}) and social layouts will keep the living quarters harmonized. A healthy, balanced roommate dynamic is anticipated.`;
  } else {
    insight = `Moderate roommate alignment. There are some notable deviations in sleep schedules or cleanliness approaches, but you share several similar hobbies which can act as common ground to build roommate rapport over the academic year.`;
  }
  insightTextEl.textContent = insight;

  let conflictAlerts = [];
  if (userPrefs.sleep_schedule !== partnerPrefs.sleep_schedule) {
    conflictAlerts.push(`Routine Conflict: One is an ${userPrefs.sleep_schedule} while the other is a ${partnerPrefs.sleep_schedule}. This might cause disturbances when adjusting lights at night.`);
  }
  if (userPrefs.cleanliness !== partnerPrefs.cleanliness && (userPrefs.cleanliness === 'Very Clean' || partnerPrefs.cleanliness === 'Very Clean')) {
    conflictAlerts.push(`Cleanliness Mismatch: Roommate standards vary (${userPrefs.cleanliness} vs ${partnerPrefs.cleanliness}). It is recommended to establish a cleaning chore schedule on day one.`);
  }

  if (conflictAlerts.length > 0) {
    conflictCard.style.display = 'block';
    conflictTextEl.innerHTML = conflictAlerts.map(c => `• ${c}`).join('<br>');
  } else {
    conflictCard.style.display = 'none';
  }

  let roomZone = '';
  if (userPrefs.room_environment === 'Quiet' && partnerPrefs.room_environment === 'Quiet') {
    roomZone = 'Quiet Zone suggested (Wing A, Floor 3). Excellent layout for students focused on silent reading and early sleep cycles.';
  } else if (userPrefs.room_environment === 'Social' || partnerPrefs.room_environment === 'Social') {
    roomZone = 'Social Zone suggested (Wing C, Floor 1). Good proximity to common rooms and dynamic project areas. Ideal for group study and active socializing.';
  } else {
    roomZone = 'Moderate/Standard Zone suggested (Wing B, Floor 2). A balanced wing providing quiet hours after 10 PM but accommodating moderate day-to-day conversations.';
  }
  roomTextEl.textContent = roomZone;
}

function drawRadarGraph(breakdown) {
  const container = document.getElementById('radar-container');
  container.innerHTML = '';

  const width = 240;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2;
  const rMax = 75;

  const axes = [
    { name: 'Sleep', val: breakdown.sleep },
    { name: 'Cleanliness', val: breakdown.clean },
    { name: 'Study', val: breakdown.study },
    { name: 'Social', val: breakdown.social },
    { name: 'Hobbies', val: breakdown.hobby }
  ];

  function getCoordinates(index, total, radius) {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  let svg = `<svg class="radar-svg" viewBox="0 0 ${width} ${height}">`;

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  gridLevels.forEach(level => {
    let pts = [];
    for (let i = 0; i < axes.length; i++) {
      const coord = getCoordinates(i, axes.length, rMax * level);
      pts.push(`${coord.x},${coord.y}`);
    }
    svg += `<polygon class="radar-grid-polygon" points="${pts.join(' ')}" />`;
  });

  axes.forEach((axis, i) => {
    const edgeCoord = getCoordinates(i, axes.length, rMax);
    svg += `<line class="radar-axis-line" x1="${cx}" y1="${cy}" x2="${edgeCoord.x}" y2="${edgeCoord.y}" />`;
    const labelCoord = getCoordinates(i, axes.length, rMax + 18);
    svg += `<text class="radar-axis-label" x="${labelCoord.x}" y="${labelCoord.y + 4}">${axis.name}</text>`;
  });

  let userPts = [];
  axes.forEach((axis, i) => {
    const radius = rMax * (axis.val / 100);
    const coord = getCoordinates(i, axes.length, radius);
    userPts.push(`${coord.x},${coord.y}`);
  });
  svg += `<polygon class="radar-value-area" points="${userPts.join(' ')}" />`;

  axes.forEach((axis, i) => {
    const radius = rMax * (axis.val / 100);
    const coord = getCoordinates(i, axes.length, radius);
    svg += `<circle cx="${coord.x}" cy="${coord.y}" r="3" fill="var(--cyan)" />`;
  });

  svg += `</svg>`;
  container.innerHTML = svg;
}

// ==========================================
// 6. ADMIN DASHBOARD ANALYTICS (CUSTOM SVGS)
// ==========================================
async function renderAdminDashboard() {
  const data = await apiRequest('get_admin_stats');
  if (data.error) {
    console.error("Failed to load admin metrics:", data.error);
    return;
  }

  const stats = data.stats;
  const charts = data.charts;

  document.getElementById('stat-total-students').textContent = stats.total_students;
  document.getElementById('stat-total-matches').textContent = stats.total_matches;
  document.getElementById('stat-allocated-rooms').textContent = stats.allocated_rooms;
  document.getElementById('stat-avg-score').textContent = `${stats.avg_score}%`;

  const ranges = { '50-60': 0, '60-70': 0, '70-80': 0, '80-90': 0, '90-100': 0 };
  charts.scores.forEach(s => {
    const scoreVal = parseInt(s);
    if (scoreVal >= 90) ranges['90-100']++;
    else if (scoreVal >= 80) ranges['80-90']++;
    else if (scoreVal >= 70) ranges['70-80']++;
    else if (scoreVal >= 60) ranges['60-70']++;
    else ranges['50-60']++;
  });
  renderScoreDistributionChartFromData(ranges);
  renderCleanlinessPieChartFromData(charts.cleanliness, stats.total_students);
  renderHobbiesBarChartFromData(charts.hobbies);
  renderSleepScheduleSplitChartFromData(charts.sleep, stats.total_students);
}

function renderScoreDistributionChartFromData(ranges) {
  const container = document.getElementById('score-dist-chart-container');
  container.innerHTML = '';
  const categories = Object.keys(ranges);
  const values = Object.values(ranges);
  const maxVal = Math.max(...values, 2);

  const width = 360;
  const height = 200;
  const paddingLeft = 30;
  const paddingBottom = 30;
  const chartWidth = width - paddingLeft - 20;
  const chartHeight = height - paddingBottom - 10;
  const barWidth = chartWidth / categories.length - 12;

  let svg = `<svg class="svg-chart" viewBox="0 0 ${width} ${height}">`;
  for (let i = 0; i <= 4; i++) {
    const yVal = paddingBottom + (chartHeight / 4) * i;
    const countVal = Math.round(maxVal - (maxVal / 4) * i);
    svg += `<line class="chart-axis" x1="${paddingLeft}" y1="${yVal}" x2="${width - 10}" y2="${yVal}" />`;
    svg += `<text class="chart-text" x="${paddingLeft - 8}" y="${yVal + 4}" text-anchor="end">${countVal}</text>`;
  }

  categories.forEach((cat, index) => {
    const count = ranges[cat];
    const barHeight = (count / maxVal) * chartHeight;
    const x = paddingLeft + (chartWidth / categories.length) * index + 6;
    const y = height - paddingBottom - barHeight;

    svg += `<rect class="bar-rect" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4"
                  onmouseover="showChartTooltip(event, '${cat}%: ${count} Matches')" 
                  onmouseout="hideChartTooltip()" />`;
    svg += `<text class="chart-text" x="${x + barWidth/2}" y="${height - 10}" text-anchor="middle">${cat}</text>`;
  });
  svg += `</svg>`;
  container.innerHTML = svg;
}

function renderCleanlinessPieChartFromData(splitData, total) {
  const container = document.getElementById('clean-pie-chart-container');
  container.innerHTML = '';
  const totalStudents = parseInt(total) || 1;
  const width = 240;
  const height = 200;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 70;

  let svg = `<svg class="svg-chart" viewBox="0 0 ${width} ${height}">`;
  let accumulatedAngle = -Math.PI / 2;
  const colors = { 'Very Clean': 'var(--emerald)', 'Average': 'var(--gold)', 'Relaxed': 'var(--primary)' };

  splitData.forEach(item => {
    const cat = item.cleanliness;
    const count = parseInt(item.count);
    const pct = count / totalStudents;
    if (pct === 0) return;

    const angle = pct * Math.PI * 2;
    const x1 = cx + radius * Math.cos(accumulatedAngle);
    const y1 = cy + radius * Math.sin(accumulatedAngle);
    const x2 = cx + radius * Math.cos(accumulatedAngle + angle);
    const y2 = cy + radius * Math.sin(accumulatedAngle + angle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    svg += `<path d="${pathData}" class="pie-slice" fill="${colors[cat] || 'var(--cyan)'}"
                  onmouseover="showChartTooltip(event, '${cat}: ${count} (${Math.round(pct*100)}%)')" 
                  onmouseout="hideChartTooltip()" />`;
    accumulatedAngle += angle;
  });

  svg += `<circle cx="${cx}" cy="${cy}" r="38" fill="var(--bg-deep-blue)" />`;
  svg += `<text x="${cx}" y="${cy + 4}" fill="#FFF" font-size="10" font-weight="600" text-anchor="middle">CLEAN INDEX</text>`;
  svg += `</svg>`;
  container.innerHTML = svg;
}

function renderHobbiesBarChartFromData(splitData) {
  const container = document.getElementById('hobbies-chart-container');
  container.innerHTML = '';
  const frequencies = {};
  ALL_HOBBIES.forEach(h => frequencies[h] = 0);
  splitData.forEach(item => {
    if (frequencies[item.hobby_name] !== undefined) frequencies[item.hobby_name] = parseInt(item.count);
  });

  const categories = Object.keys(frequencies);
  const values = Object.values(frequencies);
  const maxVal = Math.max(...values, 2);

  const width = 360;
  const height = 200;
  const paddingLeft = 65;
  const paddingRight = 20;
  const chartHeight = height - 20;
  const chartWidth = width - paddingLeft - paddingRight;
  const rowHeight = chartHeight / categories.length;

  let svg = `<svg class="svg-chart" viewBox="0 0 ${width} ${height}">`;
  categories.forEach((cat, index) => {
    const count = frequencies[cat];
    const barWidth = (count / maxVal) * chartWidth;
    const y = rowHeight * index + 6;
    const x = paddingLeft;
    
    svg += `<text class="chart-text" x="${paddingLeft - 8}" y="${y + rowHeight/2 + 3}" text-anchor="end">${cat}</text>`;
    svg += `<rect x="${x}" y="${y}" width="${chartWidth}" height="8" rx="4" fill="rgba(255,255,255,0.03)" />`;
    svg += `<rect class="bar-rect" x="${x}" y="${y}" width="${barWidth}" height="8" rx="4" fill="var(--cyan)"
                  onmouseover="showChartTooltip(event, '${cat}: ${count} selections')" 
                  onmouseout="hideChartTooltip()" />`;
  });
  svg += `</svg>`;
  container.innerHTML = svg;
}

function renderSleepScheduleSplitChartFromData(splitData, total) {
  const container = document.getElementById('sleep-chart-container');
  container.innerHTML = '';
  let early = 0;
  let late = 0;
  splitData.forEach(item => {
    if (item.sleep_schedule === 'Early Sleeper') early = parseInt(item.count);
    else late = parseInt(item.count);
  });

  const totalStudents = parseInt(total) || 1;
  const earlyPct = Math.round((early / totalStudents) * 100);
  const latePct = 100 - earlyPct;

  const width = 300;
  const height = 150;
  let svg = `<svg class="svg-chart" viewBox="0 0 ${width} ${height}">`;
  const y = 60;
  const barHeight = 22;
  const barWidth = 240;
  const xStart = 30;
  
  const earlyWidth = (early / totalStudents) * barWidth;
  const lateWidth = barWidth - earlyWidth;

  svg += `<rect x="${xStart}" y="${y}" width="${barWidth}" height="${barHeight}" rx="11" fill="rgba(255,255,255,0.05)" />`;
  if (earlyWidth > 0) {
    svg += `<rect x="${xStart}" y="${y}" width="${earlyWidth}" height="${barHeight}" rx="11" fill="var(--emerald)"
                  onmouseover="showChartTooltip(event, 'Early: ${early} Students (${earlyPct}%)')" 
                  onmouseout="hideChartTooltip()" />`;
  }
  if (lateWidth > 0) {
    svg += `<rect x="${xStart + earlyWidth}" y="${y}" width="${lateWidth}" height="${barHeight}" rx="11" fill="var(--primary)"
                  onmouseover="showChartTooltip(event, 'Late: ${late} Students (${latePct}%)')" 
                  onmouseout="hideChartTooltip()" />`;
  }

  svg += `<circle cx="30" cy="115" r="5" fill="var(--emerald)" />`;
  svg += `<text class="chart-text" x="42" y="119">Early Sleeper (${earlyPct}%)</text>`;
  svg += `<circle cx="170" cy="115" r="5" fill="var(--primary)" />`;
  svg += `<text class="chart-text" x="182" y="119">Late Sleeper (${latePct}%)</text>`;
  svg += `</svg>`;
  container.innerHTML = svg;
}

// ==========================================
// 6. SYSTEM DATABASE ERD VISUALIZER
// ==========================================
function drawERDiagramRelationships() {
  const svg = document.getElementById('erd-lines-svg');
  if (!svg) return;
  svg.innerHTML = '';

  const parentPanel = document.getElementById('erd-canvas-panel');
  const panelRect = parentPanel.getBoundingClientRect();

  const studentsEl = document.getElementById('erd-table-students');
  const prefsEl = document.getElementById('erd-table-preferences');
  const hobbiesEl = document.getElementById('erd-table-hobbies');
  const matchesEl = document.getElementById('erd-table-matches');

  if (!studentsEl || !prefsEl || !hobbiesEl || !matchesEl) return;

  function getTablePorts(el) {
    const r = el.getBoundingClientRect();
    return {
      left: { x: r.left - panelRect.left, y: r.top - panelRect.top + r.height / 2 },
      right: { x: r.right - panelRect.left, y: r.top - panelRect.top + r.height / 2 },
      top: { x: r.left - panelRect.left + r.width / 2, y: r.top - panelRect.top },
      bottom: { x: r.left - panelRect.left + r.width / 2, y: r.bottom - panelRect.top }
    };
  }

  const pStudents = getTablePorts(studentsEl);
  const pPrefs = getTablePorts(prefsEl);
  const pHobbies = getTablePorts(hobbiesEl);
  const pMatches = getTablePorts(matchesEl);

  drawCubicCurve(pStudents.right, pPrefs.left);
  drawCubicCurve(pStudents.bottom, pHobbies.top);
  drawCubicCurve(pStudents.right, pMatches.left);

  function drawCubicCurve(p1, p2) {
    const controlOffset = 60;
    const cp1x = p1.x + controlOffset;
    const cp1y = p1.y;
    const cp2x = p2.x - controlOffset;
    const cp2y = p2.y;

    const pathData = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;

    const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowPath.setAttribute('d', pathData);
    glowPath.setAttribute('class', 'erd-line-path-glow');
    
    const animPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    animPath.setAttribute('d', pathData);
    animPath.setAttribute('class', 'erd-line-path');

    svg.appendChild(glowPath);
    svg.appendChild(animPath);
  }
}

// Inspector tables modal operation
async function openDatabaseViewModal(tableName) {
  const modal = document.getElementById('db-view-modal');
  const title = document.getElementById('modal-table-title');
  const pre = document.getElementById('modal-json-pre');

  modal.classList.add('active');
  title.textContent = `Inspector: Relational Table [${tableName.toUpperCase()}]`;
  pre.textContent = "Loading records...";

  const erdData = await apiRequest('get_erd_data');
  if (erdData.error) {
    pre.textContent = "Failed to load database: " + erdData.error;
    return;
  }

  let data = [];
  if (tableName === 'students') data = erdData.students;
  else if (tableName === 'preferences') data = erdData.preferences;
  else if (tableName === 'hobbies') data = erdData.hobbies;
  else if (tableName === 'matches') data = erdData.matches;

  pre.textContent = JSON.stringify(data, null, 2);
}

function closeDatabaseViewModal() {
  document.getElementById('db-view-modal').classList.remove('active');
}

// ==========================================
// 7. BOOTSTRAP INITIALIZATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderHobbiesChips();

  // Test connection to backend immediately on load to set status badge
  apiRequest('get_admin_stats').then(() => {
    updateDbStatusBadge();
  });

  const btnToggle = document.getElementById('btn-menu-toggle');
  const sidebar = document.getElementById('app-sidebar');
  if (btnToggle && sidebar) {
    btnToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  const activeUser = getActiveUser();
  if (activeUser) {
    tempRegistration = activeUser;
    updateSidebarProfileWidget();
  }

  // Auto-populate names based on selected gender for quick-testing demo flow
  const selectGender = document.getElementById('reg-gender');
  const inputName = document.getElementById('reg-name');
  const inputEmail = document.getElementById('reg-email');
  const inputId = document.getElementById('reg-student-id');
  if (selectGender && inputName) {
    selectGender.addEventListener('change', () => {
      const gender = selectGender.value;
      const currentName = inputName.value.trim();
      const femaleNames = [
        'Anjali Das', 'Neha Roy', 'Tanvi Sen', 'Kavita Verma', 'Meera Pillai', 
        'Priya Sharma', 'Aditi Patel', 'Riya Kapoor', 'Ananya Iyer', 'Sneha Reddy'
      ];
      const maleNames = [
        'Aarav Sharma', 'Rahul Nair', 'Siddharth Patel', 'Rohan Gupta', 'Vikram Singh',
        'Amit Verma', 'Arjun Malhotra', 'Kabir Joshi', 'Aditya Sen', 'Rohan Pillai'
      ];
      
      let shouldPopulate = !currentName || 
                           (gender === 'Female' && maleNames.includes(currentName)) ||
                           (gender === 'Male' && femaleNames.includes(currentName));
                           
      if (shouldPopulate) {
        const nameList = gender === 'Female' ? femaleNames : maleNames;
        const randomName = nameList[Math.floor(Math.random() * nameList.length)];
        inputName.value = randomName;
        inputName.dispatchEvent(new Event('input'));
        
        if (!inputId.value) {
          inputId.value = 'S' + (202600 + Math.floor(Math.random() * 900 + 100));
          inputId.dispatchEvent(new Event('input'));
        }
        if (!inputEmail.value) {
          const emailPrefix = randomName.toLowerCase().replace(/\s+/g, '.');
          inputEmail.value = `${emailPrefix}@hostel.edu`;
          inputEmail.dispatchEvent(new Event('input'));
        }
      }
    });
  }
});
