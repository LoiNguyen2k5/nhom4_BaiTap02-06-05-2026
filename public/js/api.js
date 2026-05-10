// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Alert Handler
class Alert {
  static show(message, type = 'info') {
    const alertEl = document.getElementById('alert');
    if (!alertEl) return;

    alertEl.className = `alert ${type === 'error' ? 'alert-danger' : `alert-${type}`} show`;
    alertEl.textContent = message;
    alertEl.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
      alertEl.classList.remove('show');
      alertEl.style.display = 'none';
    }, 5000);
  }

  static success(message) {
    this.show(message, 'success');
  }

  static error(message) {
    this.show(message, 'error');
  }

  static info(message) {
    this.show(message, 'info');
  }
}

// API Helper
class ApiClient {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add token if exists
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      Alert.error(error.message);
      throw error;
    }
  }

  static post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  static get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  static put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }
}

// Auth Helper
class Auth {
  static saveToken(token) {
    localStorage.setItem('token', token);
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  static isLoggedIn() {
    return !!this.getToken();
  }

  static saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Utility Functions
function formatDate(dateString) {
  if (!dateString) return 'Chưa cập nhật';
  return new Date(dateString).toLocaleDateString('vi-VN');
}

function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = `<div class="loading">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>`;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10,11}$/.test(phone.replace(/\D/g, ''));
}
