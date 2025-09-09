// Lấy dữ liệu từ localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentUser = localStorage.getItem("currentUser") || null;

const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const blogSection = document.getElementById("blog-section");
const postsDiv = document.getElementById("posts");

// Hiển thị form đăng nhập/đăng ký
function showLogin() {
  registerSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
}

function showRegister() {
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
}

// Đăng ký
function register() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;

  if (!username || !password) return alert("Vui lòng nhập đầy đủ thông tin!");

  if (users.find(u => u.username === username)) {
    return alert("Tên đăng nhập đã tồn tại!");
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công! Đăng nhập ngay.");
  showLogin();
}

// Đăng nhập
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return alert("Sai tên đăng nhập hoặc mật khẩu!");

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);

  showBlog();
}

// Đăng xuất
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  loginSection.classList.remove("hidden");
  blogSection.classList.add("hidden");
}

// Hiển thị blog
function showBlog() {
  document.getElementById("current-user").innerText = currentUser;
  loginSection.classList.add("hidden");
  registerSection.classList.add("hidden");
  blogSection.classList.remove("hidden");
  renderPosts();
}

// Thêm bài viết
function addPost() {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title || !content) return alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");

  const newPost = {
    id: Date.now(),
    username: currentUser,
    title,
    content
  };

  posts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
  renderPosts();
}

// Hiển thị bài viết
function renderPosts() {
  postsDiv.innerHTML = "";
  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.content}</p>
      <small>Đăng bởi: ${post.username}</small><br>
      ${post.username === currentUser ? `
        <button onclick="editPost(${post.id})">Sửa</button>
        <button onclick="deletePost(${post.id})">Xóa</button>
      ` : ""}
    `;
    postsDiv.appendChild(div);
  });
}

// Sửa bài viết
function editPost(id) {
  const post = posts.find(p => p.id === id);
  const newTitle = prompt("Nhập tiêu đề mới:", post.title);
  const newContent = prompt("Nhập nội dung mới:", post.content);
  if (newTitle && newContent) {
    post.title = newTitle;
    post.content = newContent;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}

// Xóa bài viết
function deletePost(id) {
  if (confirm("Bạn có chắc muốn xóa bài này?")) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}

// Khi load trang, kiểm tra đăng nhập
if (currentUser) {
  showBlog();
} else {
  showLogin();
}