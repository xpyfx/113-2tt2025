document.addEventListener('DOMContentLoaded', () => {
  // 检查用户是否已登录
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // 获取用户信息
  fetchUserInfo();
  // 获取收藏列表
  fetchFavorites();

  // 导航切换
  const navLinks = document.querySelectorAll('.user-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      
      // 更新活动链接
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // 显示对应部分
      document.querySelectorAll('section').forEach(section => {
        section.style.display = section.id === targetId ? 'block' : 'none';
      });
    });
  });
});

async function fetchUserInfo() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const user = await response.json();
    
    document.getElementById('username').textContent = user.username;
    document.getElementById('register-date').textContent = new Date(user.createdAt).toLocaleDateString();
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

async function fetchFavorites() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const favorites = await response.json();
    
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = favorites.map(movie => `
      <div class="movie-card">
        <a href="./movie-details-${movie.id}.html">
          <figure class="card-banner">
            <img src="${movie.image}" alt="${movie.title}">
          </figure>
        </a>
        <div class="title-wrapper">
          <a href="./movie-details-${movie.id}.html">
            <h3 class="card-title">${movie.title}</h3>
          </a>
          <time datetime="${movie.year}">${movie.year}</time>
        </div>
        <div class="card-meta">
          <div class="badge badge-outline">HD</div>
          <div class="duration">
            <ion-icon name="time-outline"></ion-icon>
            <time datetime="PT${movie.duration}M">${movie.duration} 分钟</time>
          </div>
          <div class="rating">
            <ion-icon name="star"></ion-icon>
            <data>${movie.rating}</data>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('获取收藏列表失败:', error);
  }
} 