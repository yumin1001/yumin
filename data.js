// Initial seed data for the University Lost & Found system
const INITIAL_USERS = [
  {
    studentId: "2026010001",
    email: "chulsoo@univ.ac.kr",
    name: "김철수",
    passwordHash: "chulsoo123", // For testing simplicity
    createdAt: "2026-06-15T10:00:00Z"
  },
  {
    studentId: "2026010002",
    email: "younghee@univ.ac.kr",
    name: "이영희",
    passwordHash: "younghee123",
    createdAt: "2026-06-16T14:30:00Z"
  },
  {
    studentId: "2026010003",
    email: "minsoo@univ.ac.kr",
    name: "박민수",
    passwordHash: "minsoo123",
    createdAt: "2026-06-17T09:15:00Z"
  }
];

const INITIAL_POSTS = [
  {
    id: "post_1",
    title: "도서관 3층 열람실 에어팟 프로 2",
    type: "found",
    category: "electronics",
    location: "library",
    date: "2026-06-20",
    image: "", // Use fallback placeholder or default image in CSS
    description: "도서관 3층 노트북 열람실 안쪽 창가 자리에서 습득했습니다. 본체 케이스는 투명 젤리 케이스이고, 본체 뒤에 귀여운 고양이 스티커가 붙어 있습니다. 주인분은 연락 주세요.",
    ownerId: "2026010002", // 이영희
    ownerName: "이영희",
    status: "searching", // 'searching' (not claimed yet)
    createdAt: "2026-06-20T11:20:00Z",
    reports: []
  },
  {
    id: "post_2",
    title: "학생회관 식당 검은색 가죽 지갑",
    type: "lost",
    category: "wallet-keys",
    location: "student-union",
    date: "2026-06-19",
    image: "",
    description: "학생회관 1층 학식 먹고 자리에 놔두고 온 것 같습니다. 닥스(DAKS) 검은색 반지갑이며, 안에 학생증(김철수)과 체크카드 2장, 현금 약간이 들어 있습니다. 소중한 지갑입니다. 주우신 분 꼭 연락 부탁드립니다.",
    ownerId: "2026010001", // 김철수
    ownerName: "김철수",
    status: "searching", // 'searching' (still lost)
    createdAt: "2026-06-19T18:45:00Z",
    reports: []
  },
  {
    id: "post_3",
    title: "IT관 2층 복도 전공책 (대학미적분학)",
    type: "found",
    category: "books",
    location: "it-hall",
    date: "2026-06-21",
    image: "",
    description: "IT관 204호 앞 정수기 옆 의자에 올려져 있었습니다. 표지에 '2026학번 이대현'이라고 이름이 적혀 있습니다. 시험기간인데 얼른 찾아가세요!",
    ownerId: "2026010003", // 박민수
    ownerName: "박민수",
    status: "searching",
    createdAt: "2026-06-21T09:30:00Z",
    reports: []
  },
  {
    id: "post_4",
    title: "과학관 실습실 파란색 나이키 바람막이",
    type: "lost",
    category: "clothing",
    location: "science-hall",
    date: "2026-06-18",
    image: "",
    description: "과학관 4층 물리실습실 402호에서 수업 종료 후 깜빡하고 두고 나왔습니다. 사이즈 L 이고 파란색 바탕에 흰색 로고가 그려져 있습니다. 습득하신 분 연락주세요!",
    ownerId: "2026010001", // 김철수
    ownerName: "김철수",
    status: "searching",
    createdAt: "2026-06-18T15:10:00Z",
    reports: []
  }
];

const INITIAL_CHATS = [
  {
    id: "chat_demo",
    postId: "post_1",
    postTitle: "도서관 3층 열람실 에어팟 프로 2",
    postType: "found",
    user1: "2026010001", // 김철수
    user1Name: "김철수",
    user2: "2026010002", // 이영희
    user2Name: "이영희",
    messages: [
      {
        senderId: "2026010001",
        senderName: "김철수",
        text: "안녕하세요! 에어팟 프로 제 것 같은데 연락드립니다.",
        timestamp: "2026-06-20T12:00:00Z"
      },
      {
        senderId: "2026010002",
        senderName: "이영희",
        text: "안녕하세요! 뒤에 붙은 고양이 스티커가 무슨 색인가요? 사진 인증이 가능하신가요?",
        timestamp: "2026-06-20T12:05:00Z"
      },
      {
        senderId: "2026010001",
        senderName: "김철수",
        text: "검은색 고양이고, 꼬리가 노란색인 스티커예요! 제 폰에 연결 이력도 있습니다.",
        timestamp: "2026-06-20T12:08:00Z"
      }
    ],
    lastUpdated: "2026-06-20T12:08:00Z"
  }
];

// Initialize localStorage databases if not present
function initializeDatabase() {
  if (!localStorage.getItem("lfound_users")) {
    localStorage.setItem("lfound_users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("lfound_posts")) {
    localStorage.setItem("lfound_posts", JSON.stringify(INITIAL_POSTS));
  }
  if (!localStorage.getItem("lfound_chats")) {
    localStorage.setItem("lfound_chats", JSON.stringify(INITIAL_CHATS));
  }
}

// Global data helper object
const DB = {
  init: initializeDatabase,
  
  getUsers: () => JSON.parse(localStorage.getItem("lfound_users") || "[]"),
  saveUsers: (users) => localStorage.setItem("lfound_users", JSON.stringify(users)),
  
  getPosts: () => JSON.parse(localStorage.getItem("lfound_posts") || "[]"),
  savePosts: (posts) => localStorage.setItem("lfound_posts", JSON.stringify(posts)),
  
  getChats: () => JSON.parse(localStorage.getItem("lfound_chats") || "[]"),
  saveChats: (chats) => localStorage.setItem("lfound_chats", JSON.stringify(chats)),

  getCurrentUser: () => JSON.parse(localStorage.getItem("lfound_current_user") || "null"),
  setCurrentUser: (user) => localStorage.setItem("lfound_current_user", JSON.stringify(user)),
  logout: () => localStorage.removeItem("lfound_current_user")
};

// Seed db on load
DB.init();
