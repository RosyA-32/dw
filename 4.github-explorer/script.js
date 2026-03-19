// Elementos del DOM
const usernameInput = document.getElementById('username');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const spinner = document.getElementById('spinner');
const profileSection = document.getElementById('profileSection');
const errorMessage = document.getElementById('errorMessage');

// Elementos del perfil
const avatar = document.getElementById('avatar');
const nameEl = document.getElementById('name');
const bioEl = document.getElementById('bio');
const locationEl = document.getElementById('location');
const companyEl = document.getElementById('company');
const reposCountEl = document.getElementById('reposCount');
const followersCountEl = document.getElementById('followersCount');
const followingCountEl = document.getElementById('followingCount');
const profileLink = document.getElementById('profileLink');
const reposContainer = document.getElementById('reposContainer');

// Función para mostrar/ocultar elementos
function showLoading() {
    spinner.classList.remove('hidden');
    profileSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoading() {
    spinner.classList.add('hidden');
}

function showProfile() {
    profileSection.classList.remove('hidden');
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    profileSection.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Limpiar búsqueda
function clearSearch() {
    usernameInput.value = '';
    profileSection.classList.add('hidden');
    hideError();
}

// Función para obtener usuario y repositorios
async function fetchUserData(username) {
    if (!username.trim()) {
        showError('Por favor, ingresa un nombre de usuario.');
        return;
    }

    showLoading();
    hideError();

    try {
        // Fetch usuario
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) {
            if (userRes.status === 404) {
                throw new Error('Usuario no encontrado en GitHub.');
            } else {
                throw new Error('Error al conectar con GitHub. Inténtalo de nuevo.');
            }
        }
        const userData = await userRes.json();

        // Fetch repositorios (ordenados por estrellas, los 6 primeros)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stargazers_count&per_page=6`);
        const reposData = await reposRes.json();

        // Actualizar perfil
        avatar.src = userData.avatar_url;
        nameEl.textContent = userData.name || userData.login;
        bioEl.textContent = userData.bio || 'Sin biografía';
        locationEl.innerHTML = `📍 ${userData.location || 'Ubicación no especificada'}`;
        companyEl.innerHTML = `🏢 ${userData.company || 'Empresa no especificada'}`;
        reposCountEl.textContent = userData.public_repos;
        followersCountEl.textContent = userData.followers;
        followingCountEl.textContent = userData.following;
        profileLink.href = userData.html_url;

        // Actualizar repositorios
        if (reposData.length === 0) {
            reposContainer.innerHTML = '<p class="no-repos">No hay repositorios públicos.</p>';
        } else {
            let reposHTML = '';
            reposData.forEach(repo => {
                reposHTML += `
                    <div class="repo-card">
                        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                        <p class="repo-description">${repo.description || 'Sin descripción'}</p>
                        <div class="repo-stats">
                            <span><i>⭐</i> ${repo.stargazers_count}</span>
                            <span><i>🍴</i> ${repo.forks_count}</span>
                            <span><i>📅</i> ${new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            });
            reposContainer.innerHTML = reposHTML;
        }

        hideLoading();
        showProfile();

    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Eventos
searchBtn.addEventListener('click', () => fetchUserData(usernameInput.value));
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchUserData(usernameInput.value);
    }
});
clearBtn.addEventListener('click', clearSearch);

// Inicializar 
clearSearch();