// ==========================================================================
// Campus Find JS - Core Logic & SPA Controller
// Author: 2026131210 Kim Yoomin (김유민)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Global State Variables
  let currentUser = null;
  let activeTabType = "lost"; // 'lost' or 'found' for post creation
  let uploadedImageBase64 = ""; // Holds base64 string of uploaded file
  let activeChatRoomId = null; // Currently opened chat room

  // Friendly name translations
  const CATEGORY_MAP = {
    "electronics": "전자기기",
    "wallet-keys": "지갑 / 귀중품",
    "books": "도서 / 문구류",
    "clothing": "의류 / 잡화",
    "documents": "카드 / 신분증 / 서류",
    "others": "기타 물품"
  };

  const LOCATION_MAP = {
    "library": "중앙도서관",
    "student-union": "학생회관",
    "it-hall": "IT공학관",
    "science-hall": "자연과학관",
    "dormitory": "기숙사",
    "playground": "대운동장",
    "others": "기타 구역"
  };

  // --- 1. DOM ELEMENTS SELECTION ---
  const authScreen = document.getElementById("auth-screen");
  const appScreen = document.getElementById("app-screen");
  const loginCard = document.getElementById("login-card");
  const signupCard = document.getElementById("signup-card");

  // Navigation elements
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");
  const navUserName = document.getElementById("nav-user-name");
  const navUserId = document.getElementById("nav-user-id");
  const navUserAvatar = document.getElementById("nav-user-avatar");
  const logoutBtn = document.getElementById("logout-btn");
  const dashboardRegisterBtn = document.getElementById("dashboard-register-btn");

  // Auth Forms
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const toSignupBtn = document.getElementById("to-signup-btn");
  const toLoginBtn = document.getElementById("to-login-btn");
  const loginError = document.getElementById("login-error");
  const signupError = document.getElementById("signup-error");

  // Feed & Filters
  const feedGrid = document.getElementById("feed-items-grid");
  const feedEmptyState = document.getElementById("feed-empty-state");
  const filterSearch = document.getElementById("filter-search");
  const filterType = document.getElementById("filter-type");
  const filterCategory = document.getElementById("filter-category");
  const filterLocation = document.getElementById("filter-location");
  const searchTriggerBtn = document.getElementById("search-trigger-btn");

  // Registration Form
  const postRegisterForm = document.getElementById("post-register-form");
  const registerSectionTitle = document.getElementById("register-section-title");
  const registerPostId = document.getElementById("register-post-id");
  const tabLostBtn = document.getElementById("tab-lost-btn");
  const tabFoundBtn = document.getElementById("tab-found-btn");
  const regTitle = document.getElementById("reg-title");
  const regCategory = document.getElementById("reg-category");
  const regLocation = document.getElementById("reg-location");
  const regDate = document.getElementById("reg-date");
  const regDescription = document.getElementById("reg-description");
  const regImageFile = document.getElementById("reg-image-file");
  const imageDragArea = document.getElementById("image-drag-area");
  const uploadPromptView = document.getElementById("upload-prompt-view");
  const uploadPreviewView = document.getElementById("upload-preview-view");
  const uploadPreviewImg = document.getElementById("upload-preview-img");
  const btnRemovePreviewImg = document.getElementById("btn-remove-preview-img");
  const regCancelBtn = document.getElementById("reg-cancel-btn");
  const regSubmitBtn = document.getElementById("reg-submit-btn");
  const labelRegLocation = document.getElementById("label-reg-location");
  const labelRegDate = document.getElementById("label-reg-date");

  // Detail Modal
  const detailModal = document.getElementById("detail-modal");
  const detailCloseBtn = document.getElementById("detail-close-btn");
  const detailItemImage = document.getElementById("detail-item-image");
  const detailFallbackIcon = document.getElementById("detail-fallback-icon");
  const detailTypeBadge = document.getElementById("detail-type-badge");
  const detailStatusBadge = document.getElementById("detail-status-badge");
  const detailTitle = document.getElementById("detail-title");
  const detailOwnerName = document.getElementById("detail-owner-name");
  const detailCreatedAt = document.getElementById("detail-created-at");
  const detailLocationLabel = document.getElementById("detail-location-label");
  const detailLocation = document.getElementById("detail-location");
  const detailDateLabel = document.getElementById("detail-date-label");
  const detailDate = document.getElementById("detail-date");
  const detailCategory = document.getElementById("detail-category");
  const detailDescription = document.getElementById("detail-description");
  const detailReportBtn = document.getElementById("detail-report-btn");
  const detailContactBtn = document.getElementById("detail-contact-btn");

  // Report Modal
  const reportModal = document.getElementById("report-modal");
  const reportCloseBtn = document.getElementById("report-close-btn");
  const reportForm = document.getElementById("report-form");
  const reportPostId = document.getElementById("report-post-id");
  const reportDetailsGroup = document.getElementById("report-details-group");
  const reportCancelBtn = document.getElementById("report-cancel-btn");
  const reportReasonRadios = document.getElementsByName("report-reason");

  // Chat Center
  const chatRoomsList = document.getElementById("chat-rooms-list");
  const chatWindowPlaceholder = document.getElementById("chat-window-placeholder");
  const chatWindowActive = document.getElementById("chat-window-active");
  const activeChatPartnerAvatar = document.getElementById("active-chat-partner-avatar");
  const activeChatPartnerName = document.getElementById("active-chat-partner-name");
  const activeChatPartnerId = document.getElementById("active-chat-partner-id");
  const activeChatPostType = document.getElementById("active-chat-post-type");
  const activeChatPostTitle = document.getElementById("active-chat-post-title");
  const activeChatViewPostBtn = document.getElementById("active-chat-view-post-btn");
  const chatMessagesHistory = document.getElementById("chat-messages-history");
  const chatTypingIndicator = document.getElementById("chat-typing-indicator");
  const chatMessageForm = document.getElementById("chat-message-form");
  const chatMessageInput = document.getElementById("chat-message-input");
  const chatUnreadBadge = document.getElementById("chat-unread-badge");

  // My Page
  const profileAvatarLg = document.getElementById("profile-avatar-lg");
  const profileName = document.getElementById("profile-name");
  const profileStudentId = document.getElementById("profile-student-id");
  const profileEmail = document.getElementById("profile-email");
  const statLostCount = document.getElementById("stat-lost-count");
  const statFoundCount = document.getElementById("stat-found-count");
  const myPostsListView = document.getElementById("my-posts-list-view");
  const myPostsEmpty = document.getElementById("my-posts-empty");


  // --- 2. AUTHENTICATION LOGIC ---
  
  // Toggle Flip Card
  toSignupBtn.addEventListener("click", () => {
    loginCard.classList.add("hidden");
    signupCard.classList.remove("hidden");
    signupError.classList.add("hidden");
  });
  toLoginBtn.addEventListener("click", () => {
    signupCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
    loginError.classList.add("hidden");
  });

  // Handle Sign Up
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const studentId = document.getElementById("signup-student-id").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    signupError.classList.add("hidden");

    // Validations
    if (studentId.length !== 10 || isNaN(studentId)) {
      showError(signupError, "학번은 10자리 숫자여야 합니다.");
      return;
    }

    const users = DB.getUsers();
    
    // Check duplication
    const exists = users.find(u => u.studentId === studentId || u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showError(signupError, "이미 등록된 학번 또는 이메일입니다.");
      return;
    }

    // Create user
    const newUser = {
      studentId,
      name,
      email,
      passwordHash: password, // For mock simplicity
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    DB.saveUsers(users);

    // Auto Login
    setCurrentSession(newUser);
    signupForm.reset();
  });

  // Handle Login
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    loginError.classList.add("hidden");

    const users = DB.getUsers();
    const user = users.find(u => 
      (u.studentId === username || u.email.toLowerCase() === username.toLowerCase()) && 
      u.passwordHash === password
    );

    if (!user) {
      showError(loginError, "학번/이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    setCurrentSession(user);
    loginForm.reset();
  });

  // Logout Trigger
  logoutBtn.addEventListener("click", () => {
    DB.logout();
    currentUser = null;
    checkAuthSession();
  });

  function showError(element, msg) {
    element.textContent = msg;
    element.classList.remove("hidden");
  }

  function setCurrentSession(user) {
    DB.setCurrentUser(user);
    currentUser = user;
    checkAuthSession();
  }

  // Check Session on Start
  function checkAuthSession() {
    currentUser = DB.getCurrentUser();
    if (currentUser) {
      // Set User UI Details
      navUserName.textContent = currentUser.name;
      navUserId.textContent = currentUser.studentId;
      navUserAvatar.textContent = currentUser.name.charAt(0);
      
      authScreen.classList.add("hidden");
      appScreen.classList.remove("hidden");
      
      // Go to feed tab by default
      switchTab("feed-section");
      
      // Refresh database records in UI
      refreshAllDataViews();
    } else {
      appScreen.classList.add("hidden");
      authScreen.classList.remove("hidden");
      loginCard.classList.remove("hidden");
      signupCard.classList.add("hidden");
    }
  }


  // --- 3. SPA ROUTING & TABS ---
  function switchTab(targetSectionId) {
    // Hide all sections
    contentSections.forEach(sec => sec.classList.add("hidden"));
    // Show active section
    document.getElementById(targetSectionId).classList.remove("hidden");

    // Update active nav button
    navItems.forEach(item => {
      if (item.getAttribute("data-target") === targetSectionId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Close any open overlays when switching tabs
    closeAllModals();

    // Specific section adjustments
    if (targetSectionId === "feed-section") {
      renderFeedList();
    } else if (targetSectionId === "mypage-section") {
      renderMyPage();
    } else if (targetSectionId === "chat-section") {
      renderChatRoomList();
      updateUnreadIndicator();
    }
  }

  // Nav Item click events
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-target");
      switchTab(target);
    });
  });

  // Dashboard Create CTA
  dashboardRegisterBtn.addEventListener("click", () => {
    resetRegisterForm();
    switchTab("register-section");
  });

  function closeAllModals() {
    detailModal.classList.add("hidden");
    reportModal.classList.add("hidden");
  }


  // --- 4. FEED RENDER & FILTERING ---

  function renderFeedList() {
    const posts = DB.getPosts();
    feedGrid.innerHTML = "";

    // Read Filter States
    const searchVal = filterSearch.value.trim().toLowerCase();
    const typeVal = filterType.value;
    const catVal = filterCategory.value;
    const locVal = filterLocation.value;

    const filtered = posts.filter(post => {
      // 1. Keyword search (title + desc)
      const matchesSearch = !searchVal || 
        post.title.toLowerCase().includes(searchVal) || 
        post.description.toLowerCase().includes(searchVal);
      
      // 2. Type filter
      const matchesType = typeVal === "all" || post.type === typeVal;
      
      // 3. Category filter
      const matchesCat = catVal === "all" || post.category === catVal;
      
      // 4. Location filter
      const matchesLoc = locVal === "all" || post.location === locVal;

      return matchesSearch && matchesType && matchesCat && matchesLoc;
    });

    if (filtered.length === 0) {
      feedGrid.classList.add("hidden");
      feedEmptyState.classList.remove("hidden");
      return;
    }

    feedGrid.classList.remove("hidden");
    feedEmptyState.classList.add("hidden");

    // Sort by latest created
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    filtered.forEach(post => {
      const card = createPostCardElement(post);
      feedGrid.appendChild(card);
    });
  }

  function createPostCardElement(post) {
    const card = document.createElement("div");
    card.className = "post-card";
    
    // Fallback icon based on category
    let fallbackSVG = getCategorySVG(post.category);

    const typeLabel = post.type === "lost" ? "분실" : "습득";
    const typeClass = post.type === "lost" ? "type-lost" : "type-found";
    const statusLabel = getStatusText(post.type, post.status);
    const dateLabel = formatRelativeTime(post.createdAt);

    card.innerHTML = `
      <div class="card-img-wrapper">
        <div class="card-badges">
          <span class="badge-tag ${typeClass}">${typeLabel}</span>
          ${post.status !== "searching" ? `<span class="badge-tag status-resolved">${statusLabel}</span>` : ""}
        </div>
        ${post.image 
          ? `<img src="${post.image}" alt="${post.title}">` 
          : `<div class="card-fallback-icon">${fallbackSVG}</div>`
        }
      </div>
      <div class="card-content">
        <h3>${escapeHTML(post.title)}</h3>
        <p class="card-desc">${escapeHTML(post.description)}</p>
        <div class="card-meta-list">
          <div class="card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>장소: ${LOCATION_MAP[post.location] || post.location}</span>
          </div>
          <div class="card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>날짜: ${post.date} (${dateLabel})</span>
          </div>
        </div>
      </div>
    `;

    // Click handler to open details
    card.addEventListener("click", () => {
      openDetailModal(post.id);
    });

    return card;
  }

  // Filter actions triggers
  filterType.addEventListener("change", renderFeedList);
  filterCategory.addEventListener("change", renderFeedList);
  filterLocation.addEventListener("change", renderFeedList);
  searchTriggerBtn.addEventListener("click", renderFeedList);
  filterSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") renderFeedList();
  });


  // --- 5. POST REGISTRATION & IMAGE UPLOAD ---
  
  // Tab Switching inside Registration
  tabLostBtn.addEventListener("click", () => setRegisterType("lost"));
  tabFoundBtn.addEventListener("click", () => setRegisterType("found"));

  function setRegisterType(type) {
    activeTabType = type;
    if (type === "lost") {
      tabLostBtn.classList.add("active");
      tabFoundBtn.classList.remove("active");
      labelRegLocation.innerHTML = `분실 장소 <span class="required">*</span>`;
      labelRegDate.innerHTML = `분실 날짜 <span class="required">*</span>`;
      regTitle.placeholder = "예) 도서관 4층 노트북실 로지텍 마우스";
      regLocation.options[0].textContent = "선택하세요";
    } else {
      tabFoundBtn.classList.add("active");
      tabLostBtn.classList.remove("active");
      labelRegLocation.innerHTML = `습득 장소 <span class="required">*</span>`;
      labelRegDate.innerHTML = `습득 날짜 <span class="required">*</span>`;
      regTitle.placeholder = "예) IT공학관 2층 로비 에어팟 케이스";
    }
  }

  // Drag and Drop Upload events
  imageDragArea.addEventListener("click", () => regImageFile.click());
  imageDragArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageDragArea.classList.add("dragover");
  });
  imageDragArea.addEventListener("dragleave", () => {
    imageDragArea.classList.remove("dragover");
  });
  imageDragArea.addEventListener("drop", (e) => {
    e.preventDefault();
    imageDragArea.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  regImageFile.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleImageFile(e.target.files[0]);
    }
  });

  function handleImageFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert("파일 크기는 최대 2MB까지 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageBase64 = e.target.result;
      uploadPreviewImg.src = uploadedImageBase64;
      uploadPromptView.classList.add("hidden");
      uploadPreviewView.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }

  btnRemovePreviewImg.addEventListener("click", (e) => {
    e.stopPropagation(); // Avoid triggering parent click
    resetImageUpload();
  });

  function resetImageUpload() {
    uploadedImageBase64 = "";
    regImageFile.value = "";
    uploadPreviewImg.src = "";
    uploadPromptView.classList.remove("hidden");
    uploadPreviewView.classList.add("hidden");
  }

  function resetRegisterForm() {
    postRegisterForm.reset();
    resetImageUpload();
    registerPostId.value = "";
    registerSectionTitle.textContent = "게시물 등록";
    regSubmitBtn.textContent = "게시물 등록";
    setRegisterType("lost");
  }

  regCancelBtn.addEventListener("click", () => {
    resetRegisterForm();
    switchTab("feed-section");
  });

  // Handle Form Submission (Create & Edit)
  postRegisterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const editingId = registerPostId.value;
    const posts = DB.getPosts();

    const postData = {
      title: regTitle.value.trim(),
      category: regCategory.value,
      location: regLocation.value,
      date: regDate.value,
      description: regDescription.value.trim(),
      image: uploadedImageBase64
    };

    if (editingId) {
      // Edit Post
      const index = posts.findIndex(p => p.id === editingId);
      if (index !== -1) {
        // Keep old immutable stats
        posts[index] = {
          ...posts[index],
          ...postData,
          // If no new image was uploaded and there was an old image, keep it
          image: postData.image || posts[index].image
        };
        DB.savePosts(posts);
        alert("게시물이 성공적으로 수정되었습니다.");
      }
    } else {
      // Create Post
      const newPost = {
        id: "post_" + Date.now(),
        ...postData,
        type: activeTabType,
        ownerId: currentUser.studentId,
        ownerName: currentUser.name,
        status: "searching",
        createdAt: new Date().toISOString(),
        reports: []
      };
      posts.push(newPost);
      DB.savePosts(posts);
      alert("새로운 게시물이 등록되었습니다.");
    }

    resetRegisterForm();
    switchTab("feed-section");
  });


  // --- 6. DETAIL VIEW & REPORTING MODALS ---

  function openDetailModal(postId) {
    const posts = DB.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Title & Badges
    detailTitle.textContent = post.title;
    detailOwnerName.textContent = post.ownerName;
    detailCreatedAt.textContent = formatRelativeTime(post.createdAt);
    
    // Type Tag
    detailTypeBadge.textContent = post.type === "lost" ? "분실" : "습득";
    detailTypeBadge.className = `post-type-badge ${post.type === "lost" ? "badge-lost" : "badge-found"}`;

    // Status Tag
    const statText = getStatusText(post.type, post.status);
    detailStatusBadge.textContent = statText;

    // Image Setup
    if (post.image) {
      detailItemImage.src = post.image;
      detailItemImage.classList.remove("hidden");
      detailFallbackIcon.classList.add("hidden");
    } else {
      detailItemImage.classList.add("hidden");
      detailFallbackIcon.classList.remove("hidden");
      detailFallbackIcon.innerHTML = getCategorySVG(post.category);
    }

    // Info rows
    detailLocationLabel.textContent = post.type === "lost" ? "분실 장소" : "습득 장소";
    detailLocation.textContent = LOCATION_MAP[post.location] || post.location;
    detailDateLabel.textContent = post.type === "lost" ? "분실 날짜" : "습득 날짜";
    detailDate.textContent = formatDateKorean(post.date);
    detailCategory.textContent = CATEGORY_MAP[post.category] || post.category;
    detailDescription.textContent = post.description;

    // Action buttons config based on ownership
    const isOwner = post.ownerId === currentUser.studentId;
    if (isOwner) {
      detailContactBtn.textContent = "내가 등록한 게시물";
      detailContactBtn.disabled = true;
      detailReportBtn.classList.add("hidden");
    } else {
      detailContactBtn.textContent = "연락하기 (1:1 채팅)";
      detailContactBtn.disabled = false;
      detailReportBtn.classList.remove("hidden");
    }

    // Contact button listener setup
    detailContactBtn.replaceWith(detailContactBtn.cloneNode(true));
    const newContactBtn = document.getElementById("detail-contact-btn");
    newContactBtn.addEventListener("click", () => {
      closeAllModals();
      startChatRoom(post);
    });

    // Report button listener setup
    detailReportBtn.replaceWith(detailReportBtn.cloneNode(true));
    const newReportBtn = document.getElementById("detail-report-btn");
    newReportBtn.addEventListener("click", () => {
      openReportModal(post.id);
    });

    detailModal.classList.remove("hidden");
  }

  detailCloseBtn.addEventListener("click", () => detailModal.classList.add("hidden"));
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) detailModal.classList.add("hidden");
  });

  // Report Modal Setup
  function openReportModal(postId) {
    reportPostId.value = postId;
    reportForm.reset();
    reportDetailsGroup.classList.add("hidden");
    reportModal.classList.remove("hidden");
  }

  reportCloseBtn.addEventListener("click", () => reportModal.classList.add("hidden"));
  reportCancelBtn.addEventListener("click", () => reportModal.classList.add("hidden"));
  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) reportModal.classList.add("hidden");
  });

  // Radio button change to show/hide extra text box
  Array.from(reportReasonRadios).forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "other") {
        reportDetailsGroup.classList.remove("hidden");
      } else {
        reportDetailsGroup.classList.add("hidden");
      }
    });
  });

  reportForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const postId = reportPostId.value;
    const reasonValue = Array.from(reportReasonRadios).find(r => r.checked).value;
    const details = document.getElementById("report-details").value.trim();

    const posts = DB.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    
    if (index !== -1) {
      if (!posts[index].reports) posts[index].reports = [];
      posts[index].reports.push({
        reason: reasonValue,
        details: reasonValue === "other" ? details : "",
        reporterId: currentUser.studentId,
        timestamp: new Date().toISOString()
      });
      DB.savePosts(posts);
      alert("신고가 정상 접수되었습니다. 관리자 확인 후 즉시 처리됩니다.");
    }
    
    reportModal.classList.add("hidden");
  });


  // --- 7. CHAT LOGIC & MOCK AI RESPONDER ---

  function startChatRoom(post) {
    const chats = DB.getChats();
    
    // Check if chat room already exists between these users for this post
    let room = chats.find(c => 
      c.postId === post.id && 
      ((c.user1 === currentUser.studentId && c.user2 === post.ownerId) || 
       (c.user1 === post.ownerId && c.user2 === currentUser.studentId))
    );

    if (!room) {
      room = {
        id: "chat_" + Date.now(),
        postId: post.id,
        postTitle: post.title,
        postType: post.type,
        user1: currentUser.studentId,
        user1Name: currentUser.name,
        user2: post.ownerId,
        user2Name: post.ownerName,
        messages: [],
        lastUpdated: new Date().toISOString()
      };
      chats.push(room);
      DB.saveChats(chats);
    }

    activeChatRoomId = room.id;
    switchTab("chat-section");
    loadActiveChatWindow(room.id);
  }

  function renderChatRoomList() {
    const chats = DB.getChats();
    chatRoomsList.innerHTML = "";

    // Filter chat rooms that current user belongs to
    const myRooms = chats.filter(c => c.user1 === currentUser.studentId || c.user2 === currentUser.studentId);

    // Sort by last updated
    myRooms.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    if (myRooms.length === 0) {
      chatRoomsList.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--text-dark); font-size: 0.88rem;">
          참여 중인 대화가 없습니다.
        </div>
      `;
      return;
    }

    myRooms.forEach(room => {
      const partnerName = room.user1 === currentUser.studentId ? room.user2Name : room.user1Name;
      const partnerId = room.user1 === currentUser.studentId ? room.user2 : room.user1;
      const lastMsg = room.messages.length > 0 ? room.messages[room.messages.length - 1] : null;
      const lastMsgText = lastMsg ? lastMsg.text : "대화를 시작해 보세요.";
      const timeText = lastMsg ? formatRelativeTime(lastMsg.timestamp) : "";

      const btn = document.createElement("button");
      btn.className = `chat-room-item ${room.id === activeChatRoomId ? "active" : ""}`;
      
      btn.innerHTML = `
        <div class="chat-partner-avatar">${partnerName.charAt(0)}</div>
        <div class="room-details">
          <div class="room-meta-row">
            <span class="room-partner-name">${partnerName}</span>
            <span class="room-timestamp">${timeText}</span>
          </div>
          <p class="room-last-message">${escapeHTML(lastMsgText)}</p>
          <span class="room-post-badge">[${room.postType === "lost" ? "분실" : "습득"}] ${escapeHTML(room.postTitle)}</span>
        </div>
      `;

      btn.addEventListener("click", () => {
        activeChatRoomId = room.id;
        // re-render list to highlight active
        document.querySelectorAll(".chat-room-item").forEach(item => item.classList.remove("active"));
        btn.classList.add("active");
        loadActiveChatWindow(room.id);
      });

      chatRoomsList.appendChild(btn);
    });
  }

  function loadActiveChatWindow(roomId) {
    const chats = DB.getChats();
    const room = chats.find(c => c.id === roomId);
    if (!room) return;

    chatWindowPlaceholder.classList.add("hidden");
    chatWindowActive.classList.remove("hidden");

    // Partner info
    const partnerName = room.user1 === currentUser.studentId ? room.user2Name : room.user1Name;
    const partnerId = room.user1 === currentUser.studentId ? room.user2 : room.user1;
    activeChatPartnerAvatar.textContent = partnerName.charAt(0);
    activeChatPartnerName.textContent = partnerName;
    activeChatPartnerId.textContent = `학번: ${partnerId}`;

    // Linked Post Bar
    activeChatPostType.textContent = room.postType === "lost" ? "분실" : "습득";
    activeChatPostType.className = `type-tag ${room.postType === "lost" ? "lost" : "found"}`;
    activeChatPostTitle.textContent = room.postTitle;

    // View post link
    activeChatViewPostBtn.replaceWith(activeChatViewPostBtn.cloneNode(true));
    const newViewPostBtn = document.getElementById("active-chat-view-post-btn");
    newViewPostBtn.addEventListener("click", () => {
      openDetailModal(room.postId);
    });

    // Render Messages Stream
    chatMessagesHistory.innerHTML = "";
    
    if (room.messages.length === 0) {
      chatMessagesHistory.innerHTML = `
        <div style="text-align: center; color: var(--text-dark); font-size: 0.82rem; margin: 20px 0;">
          채팅창 개설을 완료했습니다. 상대방에게 친절한 첫 메시지를 보내보세요!
        </div>
      `;
    } else {
      room.messages.forEach(msg => {
        const wrapper = document.createElement("div");
        const isMe = msg.senderId === currentUser.studentId;
        wrapper.className = `chat-bubble-wrapper ${isMe ? "me" : "other"}`;

        const timeString = formatClockTime(msg.timestamp);

        wrapper.innerHTML = `
          <div class="sender-name-label">${isMe ? "나" : msg.senderName}</div>
          <div class="chat-bubble-row">
            <div class="bubble">${escapeHTML(msg.text)}</div>
            <span class="bubble-time">${timeString}</span>
          </div>
        `;
        chatMessagesHistory.appendChild(wrapper);
      });
    }

    // Scroll to bottom
    chatMessagesHistory.scrollTop = chatMessagesHistory.scrollHeight;
    
    // Hide typing indicator initially
    chatTypingIndicator.classList.add("hidden");
  }

  // Handle Sending Messages
  chatMessageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!activeChatRoomId) return;

    const text = chatMessageInput.value.trim();
    if (!text) return;

    const chats = DB.getChats();
    const roomIndex = chats.findIndex(c => c.id === activeChatRoomId);
    if (roomIndex === -1) return;

    const newMsg = {
      senderId: currentUser.studentId,
      senderName: currentUser.name,
      text: text,
      timestamp: new Date().toISOString()
    };

    chats[roomIndex].messages.push(newMsg);
    chats[roomIndex].lastUpdated = new Date().toISOString();
    DB.saveChats(chats);

    chatMessageInput.value = "";
    loadActiveChatWindow(activeChatRoomId);
    renderChatRoomList();

    // Trigger Mock Automatic Response
    // Reply if the other user in the room is one of our default mock accounts
    const partnerId = chats[roomIndex].user1 === currentUser.studentId ? chats[roomIndex].user2 : chats[roomIndex].user1;
    const isMockPartner = partnerId !== currentUser.studentId; // Since it's local storage, we treat anyone else as mock

    if (isMockPartner) {
      simulateMockReply(chats[roomIndex]);
    }
  });

  function simulateMockReply(room) {
    // Show typing indicator after 800ms
    setTimeout(() => {
      if (activeChatRoomId === room.id) {
        chatTypingIndicator.classList.remove("hidden");
        chatMessagesHistory.scrollTop = chatMessagesHistory.scrollHeight;
      }

      // Append message reply after another 1200ms
      setTimeout(() => {
        if (activeChatRoomId === room.id) {
          chatTypingIndicator.classList.add("hidden");
        }

        const chats = DB.getChats();
        const roomIndex = chats.findIndex(c => c.id === room.id);
        if (roomIndex === -1) return;

        // Formulate a custom reply based on the post details
        const post = DB.getPosts().find(p => p.id === room.postId) || {};
        const postTitleStr = post.title || room.postTitle;
        const postLoc = post.location ? (LOCATION_MAP[post.location] || post.location) : "학교";
        const partnerName = room.user1 === currentUser.studentId ? room.user2Name : room.user1Name;
        const partnerId = room.user1 === currentUser.studentId ? room.user2 : room.user1;

        let replyText = "";
        
        // Custom templates based on category & type
        if (room.postType === "found") {
          replyText = `안녕하세요! 네, 맞아요. 제가 얼마 전에 [${postLoc}] 근처에서 [${postTitleStr}]을 습득해서 보관하고 있습니다. 뒷면이나 디자인 등 물건 특징을 간단히 설명해주실 수 있으신가요? 본인 확인이 되면 언제든 전해드릴게요!`;
        } else {
          replyText = `안녕하세요! 제가 어제 [${postLoc}] 근처를 지나가다가 글 쓰신 [${postTitleStr}]과 비슷하게 생긴 물건을 흘려진 상태로 본 것 같아서 연락 드렸어요. 아직 현장에 있을지도 모르니 혹시 위치를 더 상세히 찾아보세요!`;
        }

        // Specific trigger replies
        const lowerInput = room.messages[room.messages.length - 1].text.toLowerCase();
        if (lowerInput.includes("언제") || lowerInput.includes("시간") || lowerInput.includes("만나요")) {
          replyText = `저는 내일 오후 3시 이후에 [${postLoc}] 건물 로비나 학생회관 1층에서 시간 괜찮습니다! 편하신 시간 말씀해 주시면 맞출게요.`;
        } else if (lowerInput.includes("고마워") || lowerInput.includes("감사")) {
          replyText = `아닙니다! 학교 분실물이 다들 빨리 주인을 찾았으면 좋겠네요. 조심히 연락 주시고 편할 때 또 채팅 주세요!`;
        }

        const replyMsg = {
          senderId: partnerId,
          senderName: partnerName,
          text: replyText,
          timestamp: new Date().toISOString()
        };

        chats[roomIndex].messages.push(replyMsg);
        chats[roomIndex].lastUpdated = new Date().toISOString();
        DB.saveChats(chats);

        if (activeChatRoomId === room.id) {
          loadActiveChatWindow(room.id);
        } else {
          // Play indicator badge
          updateUnreadIndicator();
        }
        renderChatRoomList();

      }, 1500);

    }, 800);
  }

  function updateUnreadIndicator() {
    // Just a mock indicator showing badge of "1" when you receive simulator message off-screen
    // In our simplified logic, we count how many chats have messages where you are not the last sender
    const chats = DB.getChats();
    let unreadCount = 0;

    chats.forEach(c => {
      // If we are part of the room
      if (c.user1 === currentUser.studentId || c.user2 === currentUser.studentId) {
        if (c.messages.length > 0) {
          const lastMsg = c.messages[c.messages.length - 1];
          if (lastMsg.senderId !== currentUser.studentId && c.id !== activeChatRoomId) {
            unreadCount++;
          }
        }
      }
    });

    if (unreadCount > 0) {
      chatUnreadBadge.textContent = unreadCount;
      chatUnreadBadge.classList.remove("hidden");
    } else {
      chatUnreadBadge.classList.add("hidden");
    }
  }


  // --- 8. MY PAGE MANAGEMENT ---

  function renderMyPage() {
    profileName.textContent = currentUser.name;
    profileStudentId.textContent = currentUser.studentId;
    profileEmail.textContent = currentUser.email;
    profileAvatarLg.textContent = currentUser.name.charAt(0);

    const posts = DB.getPosts();
    const myPosts = posts.filter(p => p.ownerId === currentUser.studentId);

    // Count stats
    const lostCount = myPosts.filter(p => p.type === "lost").length;
    const foundCount = myPosts.filter(p => p.type === "found").length;
    statLostCount.textContent = lostCount;
    statFoundCount.textContent = foundCount;

    myPostsListView.innerHTML = "";

    if (myPosts.length === 0) {
      myPostsListView.classList.add("hidden");
      myPostsEmpty.classList.remove("hidden");
      return;
    }

    myPostsListView.classList.remove("hidden");
    myPostsEmpty.classList.add("hidden");

    // Sort by latest
    myPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    myPosts.forEach(post => {
      const row = document.createElement("div");
      row.className = "my-post-row";

      const typeLabel = post.type === "lost" ? "분실" : "습득";
      const typeClass = post.type === "lost" ? "lost" : "found";
      
      const toggleText = post.type === "lost" ? "찾음 처리" : "인계 처리";
      const isResolved = post.status === "found" || post.status === "returned" || post.status === "claimed";

      row.innerHTML = `
        <div class="my-post-thumbnail">
          ${post.image 
            ? `<img src="${post.image}" alt="">` 
            : getCategorySVG(post.category)
          }
        </div>
        <div class="my-post-details">
          <div class="my-post-title-row">
            <span class="my-post-type-badge ${typeClass}">${typeLabel}</span>
            <h4>${escapeHTML(post.title)}</h4>
          </div>
          <div class="my-post-meta">
            <span>장소: ${LOCATION_MAP[post.location] || post.location}</span> | 
            <span>날짜: ${post.date}</span>
          </div>
        </div>
        
        <div class="my-post-actions">
          <div class="status-toggle-wrapper">
            <span>${toggleText}</span>
            <label class="switch">
              <input type="checkbox" class="status-toggle-btn" data-id="${post.id}" ${isResolved ? "checked" : ""}>
              <span class="slider"></span>
            </label>
          </div>
          
          <button class="btn btn-secondary btn-icon-sm edit-my-post-btn" data-id="${post.id}" title="수정">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          
          <button class="btn btn-danger btn-icon-sm delete-my-post-btn" data-id="${post.id}" title="삭제">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      `;

      // Status Change Toggle Switch
      const toggleSwitch = row.querySelector(".status-toggle-btn");
      toggleSwitch.addEventListener("change", (e) => {
        handleStatusToggle(post.id, e.target.checked);
      });

      // Edit Button
      const editBtn = row.querySelector(".edit-my-post-btn");
      editBtn.addEventListener("click", () => {
        loadPostToEdit(post.id);
      });

      // Delete Button
      const deleteBtn = row.querySelector(".delete-my-post-btn");
      deleteBtn.addEventListener("click", () => {
        if (confirm("정말 이 게시글을 삭제하시겠습니까? 관련 대화방 기록도 함께 정리될 수 있습니다.")) {
          handlePostDelete(post.id);
        }
      });

      myPostsListView.appendChild(row);
    });
  }

  function handleStatusToggle(postId, isChecked) {
    const posts = DB.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const type = posts[index].type;
      if (type === "lost") {
        posts[index].status = isChecked ? "found" : "searching";
      } else {
        posts[index].status = isChecked ? "returned" : "searching";
      }
      DB.savePosts(posts);
      renderMyPage();
    }
  }

  function loadPostToEdit(postId) {
    const posts = DB.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    resetRegisterForm();

    // Fill form
    registerPostId.value = post.id;
    regTitle.value = post.title;
    regCategory.value = post.category;
    regLocation.value = post.location;
    regDate.value = post.date;
    regDescription.value = post.description;

    if (post.image) {
      uploadedImageBase64 = post.image;
      uploadPreviewImg.src = post.image;
      uploadPromptView.classList.add("hidden");
      uploadPreviewView.classList.remove("hidden");
    }

    setRegisterType(post.type);
    registerSectionTitle.textContent = "게시물 수정";
    regSubmitBtn.textContent = "게시물 수정 완료";

    switchTab("register-section");
  }

  function handlePostDelete(postId) {
    let posts = DB.getPosts();
    posts = posts.filter(p => p.id !== postId);
    DB.savePosts(posts);

    // Also clean up chats related to this post
    let chats = DB.getChats();
    chats = chats.filter(c => c.postId !== postId);
    DB.saveChats(chats);

    renderMyPage();
  }


  // --- 9. VIEW FORMATTERS & UTILS ---

  function refreshAllDataViews() {
    renderFeedList();
    updateUnreadIndicator();
  }

  function getStatusText(type, status) {
    if (status === "searching") {
      return type === "lost" ? "찾는 중" : "보관 중";
    }
    if (status === "found" || status === "claimed") {
      return "해결됨 (찾음)";
    }
    if (status === "returned") {
      return "해결됨 (반환완료)";
    }
    return "해결됨";
  }

  function formatRelativeTime(isoString) {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return past.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  }

  function formatDateKorean(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
    }
    return dateString;
  }

  function formatClockTime(isoString) {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hours should be 12
    return `${ampm} ${hours}:${minutes}`;
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Get matching category inline SVG code
  function getCategorySVG(category) {
    const svgMap = {
      "electronics": `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
      "wallet-keys": `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line><path d="M16 14h.01"></path></svg>`,
      "books": `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
      "clothing": `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.37 8.91l-8.17-5.67a1.69 1.69 0 0 0-2.2 0l-8.17 5.67a1.86 1.86 0 0 0-.63 1.84L3 21h18l1.83-10.25a1.86 1.86 0 0 0-.46-1.84z"></path><path d="M10 9a2 2 0 1 0 4 0"></path></svg>`,
      "documents": `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      "others": `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
    };
    return svgMap[category] || svgMap["others"];
  }

  // --- 10. INITIALIZATION RUN ---
  checkAuthSession();

  // Polling simulation for unread messages checks
  setInterval(updateUnreadIndicator, 3000);
});
