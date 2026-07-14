import { checkAuthOnLoad, login, signup, logout, showSignupBox, showLoginBox, setAuthView } from './auth.js';
import * as api from './api.js';
import * as history from './history.js';
import * as analyze from './analyze.js';
import * as translate from './translate.js';
import * as voice from './voice.js';
import * as pdf from './pdf.js';
import { escapeHtml, showLoading, hideLoading } from './ui-utils.js';

// Expose functions to global scope so existing inline handlers keep working
window.login = login;
window.signup = signup;
window.logout = logout;
window.showSignupBox = showSignupBox;
window.showLoginBox = showLoginBox;
window.openHistoryDashboard = history.openHistoryDashboard;
window.closeHistoryDashboard = history.closeHistoryDashboard;
window.loadHistory = history.loadHistory;
window.analyze = analyze.analyze;
window.analyzeImage = analyze.analyzeImage;
window.startVoice = voice.startVoice;
window.stopVoice = voice.stopVoice;
window.downloadPDF = pdf.downloadPDF;

// Expose setAuthView so other modules can call it if needed
window.setAuthView = setAuthView;

window.addEventListener('DOMContentLoaded', () => {
    checkAuthOnLoad();
});
