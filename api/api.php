<?php
/**
 * RoomSync AI - PHP Backend REST API
 * Handles database connections, student registration, preference tracking,
 * server-side roommate compatibility calculations, and analytics KPI feeds.
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS and JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Bypasses OPTIONS preflight checks
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ==========================================
// 1. DATABASE CONNECTION
// ==========================================
$db_host = getenv('DB_HOST') ?: (isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : "localhost");
$db_name = getenv('DB_NAME') ?: (isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : "roomsync_db");
$db_user = getenv('DB_USER') ?: (isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : "root");
$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : "");
$db_port = getenv('DB_PORT') ?: (isset($_ENV['DB_PORT']) ? $_ENV['DB_PORT'] : "3306");

try {
    $db = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Determine action
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle POST payload
$raw_input = file_get_contents("php://input");
$input_data = json_decode($raw_input, true);

// ==========================================
// 2. ROUTING ACTIONS
// ==========================================
switch ($action) {
    case 'register':
        handleRegister($db, $input_data);
        break;
    case 'save_preferences':
        handleSavePreferences($db, $input_data);
        break;
    case 'get_match':
        handleGetMatch($db, $_GET);
        break;
    case 'get_admin_stats':
        handleGetAdminStats($db);
        break;
    case 'get_erd_data':
        handleGetErdData($db);
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid or missing action parameter."]);
        break;
}

// ==========================================
// 3. API ACTION HANDLERS
// ==========================================

// Action: POST ?action=register
function handleRegister($db, $data) {
    if (!$data || empty($data['student_id']) || empty($data['name']) || empty($data['gender']) || empty($data['branch']) || empty($data['year']) || empty($data['email'])) {
        http_response_code(400);
        echo json_encode(["error" => "Incomplete student registration details."]);
        return;
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO students (student_id, name, gender, branch, year, email)
            VALUES (:id, :name, :gender, :branch, :year, :email)
            ON DUPLICATE KEY UPDATE 
              name = :name, 
              gender = :gender, 
              branch = :branch, 
              year = :year, 
              email = :email
        ");
        $stmt->execute([
            'id' => $data['student_id'],
            'name' => $data['name'],
            'gender' => $data['gender'],
            'branch' => $data['branch'],
            'year' => $data['year'],
            'email' => $data['email']
        ]);

        echo json_encode(["success" => true, "message" => "Student profile registered successfully."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database write failed: " . $e->getMessage()]);
    }
}

// Action: POST ?action=save_preferences
function handleSavePreferences($db, $data) {
    if (!$data || empty($data['student_id']) || empty($data['sleep_schedule']) || empty($data['study_style']) || empty($data['cleanliness']) || empty($data['social_pref']) || empty($data['room_environment'])) {
        http_response_code(400);
        echo json_encode(["error" => "Incomplete preference selection fields."]);
        return;
    }

    $student_id = $data['student_id'];
    $hobbies = isset($data['hobbies']) ? $data['hobbies'] : [];

    try {
        $db->beginTransaction();

        // 1. Delete and insert preferences
        $stmt = $db->prepare("DELETE FROM preferences WHERE student_id = :sid");
        $stmt->execute(['sid' => $student_id]);

        $stmt = $db->prepare("
            INSERT INTO preferences (student_id, sleep_schedule, study_style, cleanliness, social_pref, room_environment)
            VALUES (:sid, :sleep, :study, :clean, :social, :env)
        ");
        $stmt->execute([
            'sid' => $student_id,
            'sleep' => $data['sleep_schedule'],
            'study' => $data['study_style'],
            'clean' => $data['cleanliness'],
            'social' => $data['social_pref'],
            'env' => $data['room_environment']
        ]);

        // 2. Delete and insert hobbies
        $stmt = $db->prepare("DELETE FROM hobbies WHERE student_id = :sid");
        $stmt->execute(['sid' => $student_id]);

        if (!empty($hobbies)) {
            $stmt = $db->prepare("INSERT INTO hobbies (student_id, hobby_name) VALUES (:sid, :hobby)");
            foreach ($hobbies as $hobby) {
                $stmt->execute([
                    'sid' => $student_id,
                    'hobby' => $hobby
                ]);
            }
        }

        $db->commit();
        echo json_encode(["success" => true, "message" => "Preferences and interests saved successfully."]);
    } catch (PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Transaction failed: " . $e->getMessage()]);
    }
}

// Action: GET ?action=get_match&student_id=XXX
function handleGetMatch($db, $params) {
    if (empty($params['student_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing student_id query parameter."]);
        return;
    }

    $user_id = $params['student_id'];

    try {
        // 1. Fetch active student profile & preferences
        $stmt = $db->prepare("SELECT * FROM students WHERE student_id = :sid");
        $stmt->execute(['sid' => $user_id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["error" => "Registered student profile not found."]);
            return;
        }

        $stmt = $db->prepare("SELECT * FROM preferences WHERE student_id = :sid");
        $stmt->execute(['sid' => $user_id]);
        $user_prefs = $stmt->fetch();

        if (!$user_prefs) {
            http_response_code(404);
            echo json_encode(["error" => "Student preferences have not been set."]);
            return;
        }

        // 2. Fetch active student hobbies
        $stmt = $db->prepare("SELECT hobby_name FROM hobbies WHERE student_id = :sid");
        $stmt->execute(['sid' => $user_id]);
        $user_hobbies = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // 3. Fetch candidates (independent of self, same gender, having preferences)
        $stmt = $db->prepare("
            SELECT s.*, p.sleep_schedule, p.study_style, p.cleanliness, p.social_pref, p.room_environment 
            FROM students s 
            JOIN preferences p ON s.student_id = p.student_id 
            WHERE s.gender = :gender AND s.student_id != :sid
        ");
        $stmt->execute([
            'gender' => $user['gender'],
            'sid' => $user_id
        ]);
        $candidates = $stmt->fetchAll();

        // Fallback to other genders if no same-gender matching profiles exist
        if (empty($candidates)) {
            $stmt = $db->prepare("
                SELECT s.*, p.sleep_schedule, p.study_style, p.cleanliness, p.social_pref, p.room_environment 
                FROM students s 
                JOIN preferences p ON s.student_id = p.student_id 
                WHERE s.student_id != :sid
            ");
            $stmt->execute(['sid' => $user_id]);
            $candidates = $stmt->fetchAll();
        }

        if (empty($candidates)) {
            echo json_encode(["message" => "No candidates available for roommate matching."]);
            return;
        }

        $best_match = null;
        $best_score = -1;

        // 4. Compatibility calculation loop
        foreach ($candidates as $cand) {
            // Fetch candidate hobbies
            $stmt = $db->prepare("SELECT hobby_name FROM hobbies WHERE student_id = :sid");
            $stmt->execute(['sid' => $cand['student_id']]);
            $cand_hobbies = $stmt->fetchAll(PDO::FETCH_COLUMN);

            // Compute sub-components
            $sleep_score = ($user_prefs['sleep_schedule'] === $cand['sleep_schedule']) ? 100 : 20;
            
            // Cleanliness score
            $clean_score = 70;
            if ($user_prefs['cleanliness'] === $cand['cleanliness']) {
                $clean_score = 100;
            } elseif (
                ($user_prefs['cleanliness'] === 'Very Clean' && $cand['cleanliness'] === 'Relaxed') ||
                ($user_prefs['cleanliness'] === 'Relaxed' && $cand['cleanliness'] === 'Very Clean')
            ) {
                $clean_score = 20;
            }

            // Study score
            $study_score = 50;
            if ($user_prefs['study_style'] === $cand['study_style']) {
                $study_score = 100;
            } elseif (
                ($user_prefs['study_style'] === 'Silent Study' && $cand['study_style'] === 'Group Study') ||
                ($user_prefs['study_style'] === 'Group Study' && $cand['study_style'] === 'Silent Study')
            ) {
                $study_score = 10;
            } elseif ($user_prefs['study_style'] === 'Flexible' || $cand['study_style'] === 'Flexible') {
                $study_score = 75;
            }

            // Social score
            $social_score = 70;
            if ($user_prefs['social_pref'] === $cand['social_pref']) {
                $social_score = 100;
            } elseif (
                ($user_prefs['social_pref'] === 'Introvert' && $cand['social_pref'] === 'Extrovert') ||
                ($user_prefs['social_pref'] === 'Extrovert' && $cand['social_pref'] === 'Introvert')
            ) {
                $social_score = 20;
            }

            // Hobby Jaccard similarity score
            $hobby_score = 0;
            if (!empty($user_hobbies) && !empty($cand_hobbies)) {
                $intersect = array_intersect($user_hobbies, $cand_hobbies);
                $union = array_unique(array_merge($user_hobbies, $cand_hobbies));
                $hobby_score = round((count($intersect) / count($union)) * 100);
            }

            // Combined weighted compatibility score
            $total_score = round(
                ($sleep_score * 0.25) +
                ($clean_score * 0.25) +
                ($study_score * 0.20) +
                ($social_score * 0.15) +
                ($hobby_score * 0.15)
            );

            if ($total_score > $best_score) {
                $best_score = $total_score;
                $best_match = [
                    "candidate" => $cand,
                    "score" => $total_score,
                    "breakdown" => [
                        "sleep" => $sleep_score,
                        "clean" => $clean_score,
                        "study" => $study_score,
                        "social" => $social_score,
                        "hobby" => $hobby_score
                    ]
                ];
            }
        }

        if ($best_match) {
            // Remove previous matching records involving this user combination to avoid duplicates
            $stmt = $db->prepare("DELETE FROM matches WHERE student_a_id = :sid OR student_b_id = :sid");
            $stmt->execute(['sid' => $user_id]);

            // Save new match in tables
            $stmt = $db->prepare("
                INSERT INTO matches (student_a_id, student_b_id, compatibility_score, match_date) 
                VALUES (:sa, :sb, :score, NOW())
            ");
            $stmt->execute([
                'sa' => $user_id,
                'sb' => $best_match['candidate']['student_id'],
                'score' => $best_match['score']
            ]);

            // Format response
            echo json_encode([
                "student_a_id" => $user_id,
                "matchPartner" => [
                    "student_id" => $best_match['candidate']['student_id'],
                    "name" => $best_match['candidate']['name'],
                    "gender" => $best_match['candidate']['gender'],
                    "branch" => $best_match['candidate']['branch'],
                    "year" => $best_match['candidate']['year'],
                    "email" => $best_match['candidate']['email']
                ],
                "score" => $best_match['score'],
                "breakdown" => $best_match['breakdown']
            ]);
        } else {
            echo json_encode(["message" => "Unable to compute roommate compatibility."]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Matching calculation failed: " . $e->getMessage()]);
    }
}

// Action: GET ?action=get_admin_stats
function handleGetAdminStats($db) {
    try {
        // 1. KPI Counts
        $total_students = $db->query("SELECT COUNT(*) FROM students")->fetchColumn();
        $total_matches = $db->query("SELECT COUNT(*) FROM matches")->fetchColumn();
        $avg_score = round($db->query("SELECT COALESCE(AVG(compatibility_score), 0) FROM matches")->fetchColumn());
        $high_matches = $db->query("SELECT COUNT(*) FROM matches WHERE compatibility_score >= 75")->fetchColumn();

        // 2. Cleanliness Split
        $stmt = $db->query("
            SELECT cleanliness, COUNT(*) as count 
            FROM preferences 
            GROUP BY cleanliness
        ");
        $cleanliness_split = $stmt->fetchAll();

        // 3. Hobbies distribution
        $stmt = $db->query("
            SELECT hobby_name, COUNT(*) as count 
            FROM hobbies 
            GROUP BY hobby_name
        ");
        $hobbies_split = $stmt->fetchAll();

        // 4. Sleep schedule split
        $stmt = $db->query("
            SELECT sleep_schedule, COUNT(*) as count 
            FROM preferences 
            GROUP BY sleep_schedule
        ");
        $sleep_split = $stmt->fetchAll();

        // 5. Compatibility Score Distribution (raw scores list for ranges groupings in JS)
        $scores = $db->query("SELECT compatibility_score FROM matches")->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            "stats" => [
                "total_students" => $total_students,
                "total_matches" => $total_matches,
                "allocated_rooms" => $high_matches, // high synergy pairings
                "avg_score" => $avg_score
            ],
            "charts" => [
                "cleanliness" => $cleanliness_split,
                "hobbies" => $hobbies_split,
                "sleep" => $sleep_split,
                "scores" => $scores
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Admin analytics compilation failed: " . $e->getMessage()]);
    }
}

// Action: GET ?action=get_erd_data
function handleGetErdData($db) {
    try {
        $students = $db->query("SELECT * FROM students")->fetchAll();
        $preferences = $db->query("SELECT * FROM preferences")->fetchAll();
        $hobbies = $db->query("SELECT * FROM hobbies")->fetchAll();
        $matches = $db->query("SELECT * FROM matches")->fetchAll();

        echo json_encode([
            "students" => $students,
            "preferences" => $preferences,
            "hobbies" => $hobbies,
            "matches" => $matches
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database ERD sync failed: " . $e->getMessage()]);
    }
}
?>
