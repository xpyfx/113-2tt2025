document.querySelector('.loginBtn')
document.querySelectorAll('.favoriteBtn')

let isLoggedIn = false;

document.querySelector('.loginBtn').addEventListener('click', function () {
    isLoggedIn = true;
    alert("登入成功！");
});

document.querySelectorAll('.favoriteBtn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (!isLoggedIn) {
            alert("請先登入，才能加入收藏！");
        } else {
            // 切換收藏狀態（你可以更進一步做已收藏標記）
            if (btn.classList.contains('favorited')) {
                btn.classList.remove('favorited');
                btn.textContent = '加入收藏';
            } else {
                btn.classList.add('favorited');
                btn.textContent = '已收藏';
            }
        }
    });
});

