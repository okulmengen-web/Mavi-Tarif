// ==========================================
// MAVİTARİF PRO - ÇEKİRDEK, BULUT VE LOG MOTORU (BÖLÜM 1/4)
// ==========================================

var supabaseClient;
var supabaseUrl = 'https://gnpmwqskzumuavlpucdg.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducG13cXNrenVtdWF2bHB1Y2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODM3MzcsImV4cCI6MjA5Njc1OTczN30.kBp-Gh69kEK0foJq7gq1YTEgejpwPZ7Mk3tZWSZHEcg';

var emailjsServiceId = 'service_vhwzf9p';
var emailjsTemplateId = 'template_oz2e5kk';
var emailjsPublicKey = 'AjU4d6eqgx7iitRmf';

const parca1 = "AQ.Ab8RN6ItU2pDjdwu2YZ7RDLAP5"
const parca2 = "DVKyXMCG7SZti2o86_7tBdHw"
const geminiApiKey = parca1 + parca2;
const MASTER_ADMIN = 'okulmengen@gmail.com';
const ADMIN_EMAILS = ['spotify201122@gmail.com', 'okulmengen@gmail.com'];
const ADMIN_TEMP_PASS = '123456';

const INGREDIENTS_DB = [
    "Dana Kıyma", "Dana Bonfile", "Dana Kuşbaşı", "Kuzu Kıyma", "Kuzu Pirzola", "Kuzu Eti", "Tavuk Göğsü", "Tavuk But", "Tavuk Kanat", "Bütün Piliç", "Hindi Göğüs", "Sucuk", "Sosis", "Salam", "Pastırma", "Somon", "Levrek", "Çipura", "Karides", "Kalamar", "Midye", "Ton Balığı",
    "Süt", "Krema", "Tereyağı", "Yoğurt", "Süzme Yoğurt", "Beyaz Peynir", "Kaşar Peyniri", "Cheddar", "Mozzarella", "Parmesan", "Tulum Peyniri", "Yumurta",
    "Domates", "Cherry Domates", "Salatalık", "Yeşil Biber", "Kapya Biber", "Sivri Biber", "Kuru Soğan", "Taze Soğan", "Sarımsak", "Patates", "Patlıcan", "Bostan Patlıcan", "Kabak", "Havuç", "Kereviz", "Mantar", "Kültür Mantarı", "İstiridye Mantarı", "Ispanak", "Pırasa", "Karnabahar", "Brokoli", "Lahana", "Enginar", 
    "Roka", "Maydanoz", "Dereotu", "Nane", "Fesleğen", "Marul", "Kıvırcık", "Avokado", "Kuşkonmaz",
    "Limon", "Portakal", "Elma", "Muz", "Çilek", "Nar",
    "Pirinç", "Osmancık Pirinç", "Baldo Pirinç", "Basmati Pirinç", "Bulgur", "Nohut", "Kuru Fasulye", "Kırmızı Mercimek", "Yeşil Mercimek", "Kinoa", "Yulaf", "Makarna", "Spagetti", "Penne", "Fettuccine", "Erişte", "Noodle",
    "Un", "Buğday Unu", "Tam Buğday Unu", "Mısır Unu", "Galeta Unu", "Ekmek Kırıntısı", "Şeker", "Pudra Şekeri", "Esmer Şeker", "Kabartma Tozu", "Vanilya", "Kuru Maya", "Yaş Maya", "Kakao", "Çikolata", "Bitter Çikolata", "Kuvertür Çikolata",
    "Tuz", "Karabiber", "Pul Biber", "Kırmızı Toz Biber", "Kimyon", "Kekik", "Biberiye", "Köri", "Zerdeçal", "Zencefil", "Tarçın", "Karanfil", "Muskat", "Sumak", "Nane (Kuru)", "Fesleğen (Kuru)", "Defne Yaprağı",
    "Zeytinyağı", "Sıvı Yağ", "Ayçiçek Yağı", "Mısır Özü Yağı", "Susam Yağı", 
    "Domates Salçası", "Biber Salçası", "Soya Sosu", "Elma Sirkesi", "Üzüm Sirkesi", "Balzamik Sirke", "Nar Ekşisi", "Bal", "Pekmez", "Hardal", "Mayonez", "Ketçap",
    "Ceviz", "Fındık", "Badem", "Antep Fıstığı", "Kaju", "Hindistan Cevizi", "Kuş Üzümü", "Çam Fıstığı", "Kapari"
];

let RECIPES = []; let STOCK_ITEMS = []; let NOTEBOOK_IDS = [];
let USERS = []; let PENDING_EDITS = []; let BLACKLIST = []; let AUDIT_LOG = []; 
let DIRECT_MESSAGES = []; let ANNOUNCEMENTS = [];
let REJECTED_REQUESTS = JSON.parse(localStorage.getItem('mavitrif_rejected')) || [];
let currentUser = null;

let isWizardUnlocked = false; let tempEditDraft = null; 
let isKitchenMode = false; let previousPage = 'dash'; let currentRecipe = null;
let portion = 4; let activeCategories = ['all']; let selectedFridgeTags = [];
let currentDmTab = 'support'; 
let dmLimit = 15;
let sessionToken = null; 
let editingSupportId = null; 
const BAD_WORDS = ["kötü", "berbat", "iğrenç", "rezil", "aptal", "salak", "küfür", "leş"];

function checkSpamProtection(actionType) {
    if (!currentUser || currentUser.role === 'admin') return true; 
    const now = Date.now();
    const lastActionTime = parseInt(localStorage.getItem(`spam_${actionType}_${currentUser.email}`)) || 0;
    const cooldownMs = 3 * 60 * 1000; 
    
    if (now - lastActionTime < cooldownMs) {
        const kalanDk = Math.ceil((cooldownMs - (now - lastActionTime)) / 60000);
        showToast(`🛡️ Spam Koruması: Lütfen ${kalanDk} dakika bekleyip tekrar deneyin.`, "error");
        return false;
    }
    localStorage.setItem(`spam_${actionType}_${currentUser.email}`, now.toString());
    return true;
}

window.getUserScore = function(email) {
    if (!email) return { avg: 0, count: 0 };
    const targetEmail = email.toLowerCase();
    const userRecipes = RECIPES.filter(r => (r.macros?.author_email || "").toLowerCase() === targetEmail && r.status !== 'pending');
    if(userRecipes.length === 0) return { avg: 0, count: 0 };
    
    let totalRating = 0; let totalReviews = 0;
    userRecipes.forEach(r => {
        if(r.reviews && r.reviews.length > 0) {
            r.reviews.forEach(rev => {
                totalRating += parseFloat(rev.rating);
                totalReviews++;
            });
        }
    });
    if(totalReviews === 0) return { avg: 0, count: 0 };
    return { avg: (totalRating / totalReviews), count: totalReviews };
}

async function safeFetch(table, queryBuilder = (q) => q.select('*')) {
    if(!supabaseClient) return [];
    try {
        const res = await queryBuilder(supabaseClient.from(table));
        if(res.error) return [];
        return res.data || [];
    } catch(e) { return []; }
}

function mapRecipeToDB(r) { return { id: r.id, name: r.name, img: r.img, content_imgs: r.contentImgs, cat: r.cat, diff: r.diff, time: r.time, base_portion: r.basePortion, tick: r.tick, status: r.status, allergens: r.allergens, is_vegan: r.isVegan, is_vejetaryen: r.isVejetaryen, sale_price: r.salePrice, macros: r.macros, ingredients: r.ingredients, mep: r.mep, steps: r.steps, reviews: r.reviews }; }
function mapRecipeFromDB(r) { let parsedMacros = r.macros; if(typeof parsedMacros === 'string') { try { parsedMacros = JSON.parse(parsedMacros); } catch(e){} } return { id: r.id, name: r.name, img: r.img, contentImgs: r.content_imgs, cat: r.cat, diff: r.diff, time: r.time, basePortion: r.base_portion, tick: r.tick, status: r.status, allergens: r.allergens, isVegan: r.is_vegan, isVejetaryen: r.is_vejetaryen, salePrice: r.sale_price, macros: parsedMacros, ingredients: r.ingredients, mep: r.mep, steps: r.steps, reviews: r.reviews }; }
function mapEditToDB(e) { return { edit_id: e.editId, original_recipe_id: e.originalRecipeId, recipe_name: e.recipeName, suggested_by: e.suggestedBy, draft: e.draft }; }
function mapEditFromDB(e) { let parsedDraft = e.draft; if(typeof parsedDraft === 'string') { try { parsedDraft = JSON.parse(parsedDraft); } catch(err){} } return { editId: e.edit_id, originalRecipeId: e.original_recipe_id, recipeName: e.recipe_name, suggestedBy: e.suggested_by, draft: parsedDraft }; }
function mapUserToDB(u) { return { email: u.email, password: u.password, name: u.name, role: u.role, bio: u.bio, avatar: u.avatar, custom_role: u.customRole, security_q: u.securityQ, security_a: u.securityA, last_active: u.lastActive, session_token: u.sessionToken }; }
function mapUserFromDB(u) { return { email: u.email, password: u.password, name: u.name, role: u.role, bio: u.bio, avatar: u.avatar, customRole: u.custom_role, securityQ: u.security_q, securityA: u.security_a, lastActive: u.last_active, sessionToken: u.session_token }; }

function saveRecipeToCloud(r) { if(supabaseClient) supabaseClient.from('recipes').upsert(mapRecipeToDB(r)).then(); }
async function deleteRecipeFromCloud(id) { if(supabaseClient) await supabaseClient.from('recipes').delete().eq('id', id); }
function saveUserToCloud(u) { if(supabaseClient) supabaseClient.from('users').upsert(mapUserToDB(u), {onConflict: 'email'}).then(); }
function deleteUserFromCloud(email) { if(supabaseClient) supabaseClient.from('users').delete().eq('email', email).then(); }
function saveStockToCloud(s) { if(supabaseClient) supabaseClient.from('stock').upsert(s).then(); }
function deleteStockFromCloud(name) { if(supabaseClient) supabaseClient.from('stock').delete().eq('name', name).then(); }
function saveBlacklistToCloud(email) { if(supabaseClient) supabaseClient.from('blacklist').upsert({email}).then(); }
function deleteBlacklistFromCloud(email) { if(supabaseClient) supabaseClient.from('blacklist').delete().eq('email', email).then(); }
function saveEditToCloud(e) { if(supabaseClient) supabaseClient.from('pending_edits').upsert(mapEditToDB(e)).then(); }
async function deleteEditFromCloud(id) { if(supabaseClient) await supabaseClient.from('pending_edits').delete().eq('edit_id', id); }
function addNotebookToCloud(email, rid) { if(supabaseClient && currentUser && currentUser.role !== 'guest') supabaseClient.from('notebook').upsert({user_email: email, recipe_id: rid}).then(); }
function removeNotebookFromCloud(email, rid) { if(supabaseClient && currentUser && currentUser.role !== 'guest') supabaseClient.from('notebook').delete().match({user_email: email, recipe_id: rid}).then(); }
async function deleteAnnouncementFromCloud(id) { if(supabaseClient) await supabaseClient.from('announcements').delete().eq('id', id); }

function saveRejectedToCloud(req) { 
    if(supabaseClient) {
        const dbReq = { id: req.id, user_email: req.userEmail, title: req.title, type: req.type, reason: req.reason, date: req.date };
        supabaseClient.from('rejected_requests').upsert(dbReq).then(); 
    } 
}

function saveSessionLocally() { 
    if(currentUser && currentUser.role !== 'guest') {
        localStorage.setItem('mavitarif_currentUser', JSON.stringify(currentUser));
        localStorage.setItem('mavitarif_sessionToken', sessionToken);
    }
}

// 🧽 GİZLİ TEST VERİSİ SÜPÜRGESİ (Konsola wipeTestData() yazıp enter'la)
window.wipeTestData = async function() {
    if(currentUser && currentUser.role === 'admin') {
        if(confirm("DİKKAT: Tüm mesajlar, destek talepleri, işlem logları ve red kayıtları tamamen silinecek. Emin misiniz?")) {
            if(supabaseClient) {
                await supabaseClient.from('direct_messages').delete().neq('id', '0');
                await supabaseClient.from('audit_logs').delete().neq('id', 0);
                await supabaseClient.from('rejected_requests').delete().neq('id', 0);
            }
            DIRECT_MESSAGES = []; AUDIT_LOG = []; REJECTED_REQUESTS = [];
            localStorage.removeItem('mavitrif_rejected');
            showToast("Veritabanı çöplerden arındırıldı. Sayfayı yenileyin (F5).", "success");
        }
    } else { showToast("Sadece sistem yöneticileri sunucu temizliği yapabilir.", "error"); }
}

let autoSyncInterval;
async function syncCloudDataSilently() {
    if(!currentUser || !supabaseClient || currentUser.role === 'guest') return;
    
    const [uData, rData, eData, dData, aData, sData, auData, rejData] = await Promise.all([
        safeFetch('users'), safeFetch('recipes'), safeFetch('pending_edits'), 
        safeFetch('direct_messages'), safeFetch('announcements'), 
        safeFetch('stock'), safeFetch('audit_logs', q => q.select('*').order('id', { ascending: false }).limit(100)),
        safeFetch('rejected_requests')
    ]);
    
    if(uData.length > 0) {
        USERS = uData.map(mapUserFromDB);
        const dbUser = USERS.find(u => u.email === currentUser.email);
        if(dbUser) {
            if(dbUser.sessionToken === 'KICKED') { logOutForce("Güvenlik: Oturumunuz sonlandırıldı!"); return; } 
            else if(dbUser.sessionToken !== sessionToken) {
                await supabaseClient.from('users').update({ session_token: 'KICKED' }).eq('email', currentUser.email);
                logOutForce("Güvenlik İhlali: Farklı cihaz tespiti!"); return;
            } else {
                const now = Date.now(); currentUser.lastActive = now;
                supabaseClient.from('users').update({ last_active: now }).eq('email', currentUser.email).then();
            }
        }
    }

    if(rData.length > 0) RECIPES = rData.map(mapRecipeFromDB); else if(rData.length === 0 && RECIPES.length > 0) RECIPES = [];
    if(eData.length > 0) PENDING_EDITS = eData.map(mapEditFromDB); else if(eData.length === 0) PENDING_EDITS = [];
    if(dData.length > 0) DIRECT_MESSAGES = dData; else if(dData.length === 0) DIRECT_MESSAGES = [];
    if(aData.length > 0) ANNOUNCEMENTS = aData; else if(aData.length === 0) ANNOUNCEMENTS = [];
    if(sData.length > 0) STOCK_ITEMS = sData; else if(sData.length === 0) STOCK_ITEMS = [];
    if(auData.length > 0) AUDIT_LOG = auData;
    if(rejData.length > 0) { REJECTED_REQUESTS = rejData.map(r => ({ id: r.id, userEmail: r.user_email, title: r.title, type: r.type, reason: r.reason, date: r.date })); localStorage.setItem('mavitrif_rejected', JSON.stringify(REJECTED_REQUESTS)); }
    
    if(typeof updateBadges === 'function') updateBadges();
    
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pId = activePage.id;
        if(pId === 'page-dash' && typeof renderDash === 'function') renderDash();
        if(pId === 'page-recipes' && typeof filterRecipes === 'function') filterRecipes();
        if(pId === 'page-approvals') { if(typeof renderPendingRecipes === 'function') renderPendingRecipes(); if(typeof renderPendingEdits === 'function') renderPendingEdits(); }
        if(pId === 'page-dms' && typeof renderUserDMs === 'function') renderUserDMs();
        if(pId === 'page-announcements' && typeof renderAdminAnnouncements === 'function') renderAdminAnnouncements();
        if(pId === 'page-audit' && typeof renderAuditLog === 'function') renderAuditLog();
        if(pId === 'page-users' && typeof renderUserManagement === 'function') renderUserManagement();
        if(pId === 'page-stock' && typeof renderStockTable === 'function') renderStockTable();
        if(pId === 'page-my-requests' && typeof renderMyRequests === 'function') renderMyRequests();
    }
}

function startAutoSync() { clearInterval(autoSyncInterval); autoSyncInterval = setInterval(syncCloudDataSilently, 10000); }

function logOutForce(msg) {
    currentUser = null; sessionToken = null; NOTEBOOK_IDS = []; 
    localStorage.removeItem('mavitarif_currentUser'); localStorage.removeItem('mavitarif_sessionToken');
    if(document.getElementById('main-app-container')) document.getElementById('main-app-container').style.display = 'none'; 
    if(document.getElementById('auth-screen')) document.getElementById('auth-screen').style.display = 'flex'; 
    if(typeof toggleAuthMode === 'function') toggleAuthMode('login'); 
    if(typeof hideAuthErrors === 'function') hideAuthErrors(); 
    if(typeof showToast === 'function') showToast(msg, "error");
}

async function cleanupOldData() {
    const now = Date.now(); const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (currentUser && currentUser.role === 'admin' && window.supabaseClient) {
        const limit30 = now - thirtyDays;
        AUDIT_LOG = AUDIT_LOG.filter(log => log.id > limit30); supabaseClient.from('audit_logs').delete().lt('id', limit30).then();
        DIRECT_MESSAGES.forEach(dm => { const dmTime = parseInt(dm.id.split('_')[1]); if(dmTime < limit30) supabaseClient.from('direct_messages').delete().eq('id', dm.id).then(); });
        REJECTED_REQUESTS = REJECTED_REQUESTS.filter(r => r.id > limit30); localStorage.setItem('mavitrif_rejected', JSON.stringify(REJECTED_REQUESTS)); supabaseClient.from('rejected_requests').delete().lt('id', limit30).then();
    }
}

async function logAdminAction(actionDetail) {
    if(!currentUser || currentUser.role === 'guest') return;
    const logEntry = { id: Date.now(), log_date: new Date().toLocaleString('tr-TR'), user_name: currentUser.name, user_email: currentUser.email, action: actionDetail };
    AUDIT_LOG.unshift(logEntry); if(AUDIT_LOG.length > 100) AUDIT_LOG.pop(); 
    const auditPage = document.getElementById('page-audit');
    if(currentUser.role === 'admin' && auditPage && auditPage.classList.contains('active')) { if(typeof renderAuditLog === 'function') renderAuditLog(); }
    if(supabaseClient) await supabaseClient.from('audit_logs').insert([logEntry]);
}

function renderAuditLog() {
    const tbody = document.getElementById('audit-table-body'); if(!tbody || !currentUser || currentUser.role !== 'admin') return;
    if(AUDIT_LOG.length === 0) { tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 30px; color:#94a3b8;">Henüz kayıtlı bir işlem bulunmamaktadır.</td></tr>'; return; }
    tbody.innerHTML = AUDIT_LOG.map(log => {
        const lDate = log.log_date || log.created_at || new Date(log.id).toLocaleString('tr-TR');
        const uName = log.user_name || log.admin_name || 'Bilinmiyor'; const uEmail = log.user_email || log.admin_email || '-';
        return `<tr><td style="font-size:13px; color:#64748b; font-weight: 600;">${lDate}</td><td><strong style="color:var(--primary); font-size: 14px;">${uName}</strong><br><span style="font-size:11px; color:#94a3b8;">${uEmail}</span></td><td style="font-weight:600; color:var(--bg-dark); font-size: 14px;">${log.action}</td></tr>`;
    }).join('');
}
// ==========================================
// MAVİTARİF PRO - GİRİŞ, BİLDİRİM ZİLİ & KULLANICI YÖNETİMİ (BÖLÜM 2/4)
// ==========================================

async function startMaviTarif() {
    if(!window.supabase) { showToast("Supabase yüklenemedi. Lütfen internetinizi kontrol edin.", "error"); return; }
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    showToast("Bulut senkronizasyonu başlatılıyor... ☁️", "info");
    startAutoSync();

    const [uData, bData, rData, sData, eData, auData, dmData, annData, rejData] = await Promise.all([
        safeFetch('users'), safeFetch('blacklist'), safeFetch('recipes'), safeFetch('stock'),
        safeFetch('pending_edits'), safeFetch('audit_logs', q => q.select('*').order('id', { ascending: false }).limit(100)),
        safeFetch('direct_messages'), safeFetch('announcements'), safeFetch('rejected_requests')
    ]);

    if(uData.length > 0) USERS = uData.map(mapUserFromDB); 
    if(bData.length > 0) BLACKLIST = bData.map(x => x.email); 
    if(rData.length > 0) RECIPES = rData.map(mapRecipeFromDB);
    if(sData.length > 0) STOCK_ITEMS = sData; 
    if(eData.length > 0) PENDING_EDITS = eData.map(mapEditFromDB); 
    if(auData.length > 0) AUDIT_LOG = auData;
    if(dmData.length > 0) DIRECT_MESSAGES = dmData;
    if(annData.length > 0) ANNOUNCEMENTS = annData;
    if(rejData.length > 0) {
        REJECTED_REQUESTS = rejData.map(r => ({ id: r.id, userEmail: r.user_email, title: r.title, type: r.type, reason: r.reason, date: r.date }));
        localStorage.setItem('mavitrif_rejected', JSON.stringify(REJECTED_REQUESTS));
    }

    ADMIN_EMAILS.forEach(email => {
        if (!USERS.find(user => user.email.toLowerCase() === email.toLowerCase())) { 
            const adminUser = { 
                email: email, password: ADMIN_TEMP_PASS, 
                name: email === MASTER_ADMIN ? 'Okul Mengen (Süper Yönetici)' : 'Toprak Bostancı', 
                role: 'admin', customRole: 'Baş Şef', bio: 'Mutfakta kriz yok, planlama var! 👨‍🍳', avatar: null,
                securityQ: null, securityA: null, lastActive: null, sessionToken: null
            }; 
            USERS.push(adminUser); saveUserToCloud(adminUser); 
        }
    });

    const savedSessionStr = localStorage.getItem('mavitarif_currentUser');
    const savedToken = localStorage.getItem('mavitarif_sessionToken');
    const loginTime = parseInt(localStorage.getItem('mavitarif_loginTime')) || 0;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000; // 30 Günlük Süre Zırhı

    if(savedSessionStr) {
        // 30 GÜN KONTROLÜ BURADA YAPILIYOR
        if (Date.now() - loginTime > thirtyDaysMs) {
            localStorage.removeItem('mavitarif_currentUser'); 
            localStorage.removeItem('mavitarif_sessionToken');
            showToast("🛡️ Güvenlik: 30 günlük oturum süreniz doldu. Lütfen yeniden giriş yapın.", "warning");
        } else {
            try {
                const parsedSession = JSON.parse(savedSessionStr);
                if(BLACKLIST.includes(parsedSession.email.toLowerCase())) {
                    localStorage.removeItem('mavitarif_currentUser'); localStorage.removeItem('mavitarif_sessionToken');
                    showToast("Sistemden kalıcı olarak yasaklanmışsınız.", "error");
                } else {
                    const found = USERS.find(u => u.email.toLowerCase() === parsedSession.email.toLowerCase());
                    if(found && found.role !== 'guest') {
                        if(found.sessionToken === 'KICKED' || (found.sessionToken && found.sessionToken !== savedToken)) {
                            localStorage.removeItem('mavitarif_currentUser'); localStorage.removeItem('mavitarif_sessionToken');
                            showToast("Güvenlik: Oturumunuz başka bir cihazda açıldığı için sonlandırıldı.", "error");
                        } else {
                            currentUser = found; sessionToken = savedToken || "TOKEN_" + Date.now();
                            finalizeLogin(`Tekrar hoş geldin, ${currentUser.name}!`);
                            return;
                        }
                    }
                }
            } catch(e) {}
        }
    }
    
    document.getElementById('auth-screen').style.display = 'flex'; document.getElementById('main-app-container').style.display = 'none';
}

function applyAuthUI() {
    if(!currentUser) return;
    document.getElementById('sb-profile-name').textContent = currentUser.name; 
    const roleBadge = document.getElementById('sb-profile-role');
    const adminElements = document.querySelectorAll('.admin-only');
    const userElements = document.querySelectorAll('.user-only');
    let scoreEl = document.getElementById('sb-profile-score');
    if(!scoreEl) {
        scoreEl = document.createElement('div');
        scoreEl.id = 'sb-profile-score';
        roleBadge.parentNode.appendChild(scoreEl);
    }
    
    if (currentUser.role === 'admin') {
        scoreEl.innerHTML = `<div style="margin-top:6px; font-size:11px; font-weight:800; color:#1e3a8a; background:#eff6ff; border:1px solid #bfdbfe; padding:3px 8px; border-radius:6px; display:inline-block;">🛡️ Sistem Yöneticisi</div>`;
    } else if (currentUser.role !== 'guest') {
        let scoreData = getUserScore(currentUser.email);
        if(scoreData.count > 0) {
            scoreEl.innerHTML = `<div style="margin-top:6px; font-size:11px; font-weight:800; color:#b45309; background:#fffbeb; border:1px solid #fde68a; padding:3px 8px; border-radius:6px; display:inline-block; box-shadow:0 2px 5px rgba(245,158,11,0.1);">⭐ ${scoreData.avg.toFixed(1)} İtibar</div>`;
        } else {
            scoreEl.innerHTML = `<div style="margin-top:6px; font-size:11px; font-weight:800; color:#64748b; background:#f1f5f9; border:1px solid #e2e8f0; padding:3px 8px; border-radius:6px; display:inline-block;">👨‍🍳 Yeni Şef</div>`;
        }
    } else {
        scoreEl.innerHTML = '';
    }
    
    if (currentUser.role === 'guest') {
        roleBadge.textContent = 'Misafir Kullanıcı'; roleBadge.style.background = '#64748b'; 
        adminElements.forEach(el => el.style.display = 'none'); userElements.forEach(el => el.style.display = 'none');
        const upgradeCard = document.getElementById('guest-upgrade-card'); const mainProfileCard = document.getElementById('profile-main-card'); const passProfileCard = document.getElementById('profile-password-card');
        if(upgradeCard) upgradeCard.style.display = 'block'; if(mainProfileCard) mainProfileCard.style.display = 'none'; if(passProfileCard) passProfileCard.style.display = 'none';
    } else {
        roleBadge.textContent = currentUser.customRole || (currentUser.role === 'admin' ? 'Baş Şef' : 'Kullanıcı');
        if (currentUser.role === 'admin') { 
            roleBadge.style.background = 'var(--amber)'; adminElements.forEach(el => el.style.display = ''); userElements.forEach(el => el.style.display = 'none');
        } else { 
            roleBadge.style.background = 'var(--primary)'; adminElements.forEach(el => el.style.display = 'none'); userElements.forEach(el => el.style.display = '');
        }
        const upgradeCard = document.getElementById('guest-upgrade-card'); const mainProfileCard = document.getElementById('profile-main-card'); const passProfileCard = document.getElementById('profile-password-card');
        if(upgradeCard) upgradeCard.style.display = 'none'; if(mainProfileCard) mainProfileCard.style.display = 'flex'; if(passProfileCard) passProfileCard.style.display = 'block';
    }
    if (currentUser.avatar) document.getElementById('sb-profile-img').src = currentUser.avatar;
    // --- SADECE SÜPER YÖNETİCİ BAKIM BUTONUNU GÖREBİLİR ---
    const maintBtn = document.getElementById('super-admin-maintenance-btn');
    if (maintBtn) {
        // GÜVENLİK KİLİDİ: Kullanıcı varsa VE emaili tanımlıysa kontrol et
        if (currentUser && currentUser.email && currentUser.email.toLowerCase() === 'okulmengen@gmail.com') {
            maintBtn.style.display = 'block';
        } else {
            maintBtn.style.display = 'none';
        }
    }
    }

function updateBadges() {
    if(!currentUser || currentUser.role === 'guest') return;
    let totalNotifications = 0;
    const myEmail = currentUser.email.toLowerCase();

    // Normal Mesajlar
    const unreadDMs = DIRECT_MESSAGES.filter(dm => (dm.to_email || dm.toEmail || "").toLowerCase() === myEmail && !dm.is_support && !(dm.isRead || dm.is_read)).length;
    
    // Destek Mesajları (Eğer bana gelen bir destek/yönetim mesajı varsa ve okumadıysam)
    const unreadSupportDMs = DIRECT_MESSAGES.filter(dm => (dm.to_email || dm.toEmail || "").toLowerCase() === myEmail && dm.is_support && !(dm.isRead || dm.is_read)).length;

    const badgeDm = document.getElementById('badge-dms');
    const totalDmMessages = unreadDMs + unreadSupportDMs;
    
    if(badgeDm) { 
        badgeDm.style.display = totalDmMessages > 0 ? 'flex' : 'none'; 
        if(totalDmMessages > 0) badgeDm.innerText = totalDmMessages; 
    }
    totalNotifications += totalDmMessages;

    if (currentUser.role === 'admin') {
        const currentPendingTotal = RECIPES.filter(r => r.status === 'pending').length + PENDING_EDITS.length;
        let viewedPendingTotal = parseInt(localStorage.getItem(`viewedPending_${myEmail}`)) || 0;
        if (viewedPendingTotal > currentPendingTotal) { viewedPendingTotal = currentPendingTotal; localStorage.setItem(`viewedPending_${myEmail}`, viewedPendingTotal); }
        const unreadAdmin = currentPendingTotal - viewedPendingTotal;
        const badgeApprovals = document.getElementById('badge-approvals');
        if(badgeApprovals) { badgeApprovals.style.display = unreadAdmin > 0 ? 'flex' : 'none'; if(unreadAdmin > 0) badgeApprovals.innerText = unreadAdmin; }
        totalNotifications += unreadAdmin;

        // Admin için okunmamış Destek Talepleri
        const unreadSupportTickets = DIRECT_MESSAGES.filter(dm => {
            const to = (dm.to_email || dm.toEmail || "").toLowerCase();
            return (to === MASTER_ADMIN.toLowerCase() || dm.is_support === true) && !(dm.isRead || dm.is_read);
        }).length;
        totalNotifications += unreadSupportTickets;

    } else {
        const myRejCount = REJECTED_REQUESTS.filter(r => (r.userEmail || "").toLowerCase() === myEmail).length;
        let viewedRejCount = parseInt(localStorage.getItem(`viewedRej_${myEmail}`)) || 0;
        if(viewedRejCount > myRejCount) { viewedRejCount = myRejCount; localStorage.setItem(`viewedRej_${myEmail}`, viewedRejCount); }
        const unreadUser = myRejCount - viewedRejCount;
        const badgeReq = document.getElementById('badge-my-requests');
        if(badgeReq) { badgeReq.style.display = unreadUser > 0 ? 'flex' : 'none'; if(unreadUser > 0) badgeReq.innerText = unreadUser; }
        totalNotifications += unreadUser;
    }

    const readAnnCount = parseInt(localStorage.getItem(`readAnnCount_${myEmail}`)) || 0; 
    const unreadAnn = ANNOUNCEMENTS.length - readAnnCount;
    if(unreadAnn > 0) totalNotifications += unreadAnn;
    if(typeof updateInboxBadge === 'function') updateInboxBadge();

    const bellBadge = document.getElementById('badge-notifications');
    if(bellBadge) {
        bellBadge.style.display = totalNotifications > 0 ? 'flex' : 'none';
        bellBadge.innerText = totalNotifications;
    }
}

window.openNotificationsModal = function() {
    if(currentUser.role === 'guest') { showToast("Bildirim merkezi sadece kalıcı üyeler içindir.", "warning"); return; }
    const box = document.getElementById('notifications-list');
    box.innerHTML = '';
    let hasItems = false;
    const myEmail = currentUser.email.toLowerCase();

    // 1. Yeni Normal Mesajlar
    const unreadDMs = DIRECT_MESSAGES.filter(dm => (dm.to_email || dm.toEmail || "").toLowerCase() === myEmail && !dm.is_support && !(dm.isRead || dm.is_read));
    unreadDMs.forEach(dm => {
        hasItems = true;
        box.innerHTML += `<div style="padding:15px; border-bottom:1px solid #e2e8f0; border-left:4px solid var(--primary); background:#f8fafc; margin-bottom:10px;"><b>📩 Yeni Mesaj:</b> ${dm.subject} <br><button onclick="goPage('dms', document.getElementById('nav-dms')); closeNotificationsModal(); switchDmTab('inbox');" style="margin-top:5px; background:var(--primary); color:white; padding:4px 8px; border:none; border-radius:4px; font-size:12px; cursor:pointer;">Mesajlara Git</button></div>`;
    });

    // 2. Yeni Destek / Yönetim Mesajları (Kullanıcı için)
    if(currentUser.role !== 'admin') {
        const unreadSupportDMs = DIRECT_MESSAGES.filter(dm => (dm.to_email || dm.toEmail || "").toLowerCase() === myEmail && dm.is_support && !(dm.isRead || dm.is_read));
        unreadSupportDMs.forEach(dm => {
            hasItems = true;
            box.innerHTML += `<div style="padding:15px; border-bottom:1px solid #e2e8f0; border-left:4px solid var(--green); background:#f0fdf4; margin-bottom:10px;"><b style="color:var(--green);">✅ Yönetim Yanıtı:</b> ${dm.subject} <br><button onclick="goPage('dms', document.getElementById('nav-dms')); closeNotificationsModal(); switchDmTab('support');" style="margin-top:5px; background:var(--green); color:white; padding:4px 8px; border:none; border-radius:4px; font-size:12px; cursor:pointer;">Desteğe Git</button></div>`;
        });
    }

    // 3. Yeni Duyurular
    const readAnnCount = parseInt(localStorage.getItem(`readAnnCount_${myEmail}`)) || 0;
    const unreadAnn = ANNOUNCEMENTS.length - readAnnCount;
    if(unreadAnn > 0) {
        hasItems = true;
        box.innerHTML += `<div style="padding:15px; border-bottom:1px solid #e2e8f0; border-left:4px solid var(--primary); background:#eff6ff; margin-bottom:10px;"><b style="color:var(--primary);">📢 ${unreadAnn} Yeni Duyuru:</b> Yönetimden yeni mesajınız var.<br><button onclick="openInboxModal(); closeNotificationsModal();" style="margin-top:5px; background:var(--primary); color:white; padding:4px 8px; border:none; border-radius:4px; font-size:12px; cursor:pointer;">Duyuruları Oku</button></div>`;
    }

    // 4. Yönetici için Onay ve Destek Talepleri
    if (currentUser.role === 'admin') {
        const unreadSupport = DIRECT_MESSAGES.filter(dm => {
            const to = (dm.to_email || dm.toEmail || "").toLowerCase();
            return (to === MASTER_ADMIN.toLowerCase() || dm.is_support === true) && !(dm.isRead || dm.is_read);
        });
        unreadSupport.forEach(dm => {
            hasItems = true;
            box.innerHTML += `<div style="padding:15px; border-bottom:1px solid #e2e8f0; border-left:4px solid var(--amber); background:#fffbeb; margin-bottom:10px;"><b style="color:#b45309;">🛠️ Yeni Destek Talebi:</b> ${dm.subject} <br><button onclick="goPage('dms', document.getElementById('nav-dms')); closeNotificationsModal(); switchDmTab('support');" style="margin-top:5px; background:var(--amber); color:white; padding:4px 8px; border:none; border-radius:4px; font-size:12px; cursor:pointer;">Taleplere Git</button></div>`;
        });
        
        const currentPendingTotal = RECIPES.filter(r => r.status === 'pending').length + PENDING_EDITS.length;
        let viewedPendingTotal = parseInt(localStorage.getItem(`viewedPending_${myEmail}`)) || 0;
        const unreadAdmin = currentPendingTotal - viewedPendingTotal;
        if(unreadAdmin > 0) {
            hasItems = true;
            box.innerHTML += `<div style="padding:15px; border-bottom:1px solid #e2e8f0; border-left:4px solid var(--green); background:#f0fdf4; margin-bottom:10px;"><b style="color:#15803d;">⏳ Onay Bekleyenler:</b> ${unreadAdmin} adet yeni onay sizi bekliyor. <br><button onclick="goPage('approvals', document.getElementById('nav-approvals')); closeNotificationsModal();" style="margin-top:5px; background:var(--green); color:white; padding:4px 8px; border:none; border-radius:4px; font-size:12px; cursor:pointer;">Onaylara Git</button></div>`;
        }
    } else {
         const myRejCount = REJECTED_REQUESTS.filter(r => (r.userEmail || "").toLowerCase() === myEmail).length;
         let viewedRejCount = parseInt(localStorage.getItem(`viewedRej_${myEmail}`)) || 0;
         const unreadUser = myRejCount - viewedRejCount;
         if(unreadUser > 0) {
             hasItems = true;
             box.innerHTML += `<div style="padding:15px; border-bottom:1px solid #e2e8f0; border-left:4px solid var(--red); background:#fef2f2; margin-bottom:10px;"><b style="color:#991b1b;">❌ Reddedilen Talepleriniz Var</b><br><button onclick="goPage('my-requests', document.getElementById('nav-my-requests')); closeNotificationsModal();" style="margin-top:5px; background:var(--red); color:white; padding:4px 8px; border:none; border-radius:4px; font-size:12px; cursor:pointer;">Taleplere Git</button></div>`;
         }
    }

    if(!hasItems) { box.innerHTML = '<div class="empty-state" style="padding: 30px;">Şu an için yeni bir bildiriminiz yok. 🎉</div>'; }
    document.getElementById('notifications-modal').style.display = 'block';
}
window.closeNotificationsModal = function() { document.getElementById('notifications-modal').style.display = 'none'; }

function showToast(msg, type = "success") {
    const container = document.getElementById('toast-container'); if(!container) return;
    const toast = document.createElement('div'); toast.className = 'toast';
    let borderColor = "var(--green)"; let icon = "✅";
    if(type === "error") { borderColor = "var(--red)"; icon = "❌"; } else if(type === "warning") { borderColor = "var(--amber)"; icon = "⚠️"; } else if(type === "info") { borderColor = "var(--primary)"; icon = "ℹ️"; }
    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `<div style="display:flex; align-items:center; gap:10px;"><span style="font-size:18px;">${icon}</span><span>${msg}</span></div><button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:20px;color:#94a3b8;font-weight:bold;">&times;</button>`;
    container.appendChild(toast); setTimeout(() => { if(toast.parentElement) toast.remove(); }, 4000);
}

function showAuthError(boxId, msg) { const box = document.getElementById(boxId); if(box) { box.style.display = 'block'; box.textContent = msg; } }
function hideAuthErrors() { const loginBox = document.getElementById('login-error-box'); const regBox = document.getElementById('register-error-box'); if(loginBox) loginBox.style.display = 'none'; if(regBox) regBox.style.display = 'none'; }

function toggleAuthMode(mode) {
    hideAuthErrors(); document.getElementById('login-module').style.display = 'none'; document.getElementById('register-module').style.display = 'none'; document.getElementById('forgot-module').style.display = 'none';
    if (mode === 'register') { document.getElementById('register-module').style.display = 'block'; } else if (mode === 'forgot') { document.getElementById('forgot-module').style.display = 'block'; document.getElementById('forgot-code-group').style.display = 'none'; document.getElementById('forgot-pass-group').style.display = 'none'; document.getElementById('btn-forgot-submit').style.display = 'none'; } else { document.getElementById('login-module').style.display = 'block'; }
}

let regCodeVal = null; let forgotCodeVal = null; let regTimeout = null; let forgotTimeout = null;
function sendRegistrationCode(type) {
    if(!checkSpamProtection('send_code')) return;
    if(!window.emailjs) { showToast("EmailJS yüklenmedi.", "error"); return; }
    
    let emailInputId = type === 'register' ? 'reg-email' : (type === 'forgot' ? 'forgot-email' : 'upgrade-email');
    let btnId = type === 'register' ? 'btn-send-code' : (type === 'forgot' ? 'btn-send-forgot-code' : 'btn-send-upgrade-code');
    const email = document.getElementById(emailInputId).value.trim().toLowerCase();
    
    if(!email) { if(type==='upgrade') showToast('Geçerli bir e-posta girin.', 'error'); else showAuthError(type+'-error-box', 'Geçerli bir e-posta girin.'); return; }
    if(BLACKLIST.includes(email)) { if(type==='upgrade') showToast('Bu e-posta yasaklanmıştır!', 'error'); else showAuthError(type+'-error-box', 'Bu e-posta yasaklanmıştır!'); return; }
    
    const existingUser = USERS.find(u => u.email.toLowerCase() === email);
    if((type === 'register' || type === 'upgrade') && existingUser) { if(type==='upgrade') showToast('Bu e-posta zaten kayıtlı!', 'error'); else showAuthError('register-error-box', 'Bu e-posta zaten kayıtlı!'); return; }
    if(type === 'forgot' && !existingUser) { showToast("Kayıtlı hesap bulunamadı!", "error"); return; }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const userName = existingUser ? existingUser.name : (document.getElementById('reg-name')?.value.trim() || "Kullanıcı");
    const templateParams = { user_name: userName, user_email: email, verification_code: generatedCode };
    
    const btn = document.getElementById(btnId);
    if(btn) { btn.innerText = "Gönderiliyor..."; btn.disabled = true; }
    
    emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams, emailjsPublicKey).then(function(response) { 
        showToast("KOD GÖNDERİLDİ! E-postanızı kontrol edin.", "success"); 
        if(btn) { btn.innerText = "Kod Gönderildi"; btn.style.background = "var(--green)"; btn.disabled = false; }
        
        if(type === 'register' || type === 'upgrade') {
            regCodeVal = generatedCode; clearTimeout(regTimeout);
            regTimeout = setTimeout(() => { regCodeVal = null; if(btn){ btn.innerText = "Tekrar Gönder"; btn.style.background = "var(--primary)"; } }, 180000); 
        } else if (type === 'forgot') {
            forgotCodeVal = generatedCode; document.getElementById('forgot-code-group').style.display = 'block'; document.getElementById('forgot-pass-group').style.display = 'block'; document.getElementById('btn-forgot-submit').style.display = 'block';
            clearTimeout(forgotTimeout);
            forgotTimeout = setTimeout(() => { forgotCodeVal = null; if(btn){ btn.innerText = "Tekrar Gönder"; btn.style.background = "var(--primary)"; } }, 180000);
        }
    }, function(error) { 
        if(btn){ btn.innerText = "Hata"; btn.disabled = false; } 
        if(type==='upgrade') showToast('E-Posta gönderilemedi.', 'error'); else showAuthError(type+'-error-box', 'E-Posta gönderilemedi.');
    });
}

function handleRegister(e) {
    e.preventDefault(); hideAuthErrors();
    const name = document.getElementById('reg-name').value.trim(); const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const code = document.getElementById('reg-code').value.trim(); const pass1 = document.getElementById('reg-pass').value; const pass2 = document.getElementById('reg-pass2').value;
    const secQ = document.getElementById('reg-security-question').value; const secA = document.getElementById('reg-security-answer').value.trim();
    if(pass1 !== pass2) { showAuthError('register-error-box', 'Şifreler eşleşmiyor!'); return; }
    if(code !== regCodeVal || !regCodeVal) { showAuthError('register-error-box', 'Hatalı veya süresi dolmuş kod!'); return; }

    const newUser = { email: email, name: name, password: pass1, role: "user", customRole: "Kullanıcı", avatar: null, bio: "", securityQ: secQ, securityA: secA, lastActive: Date.now(), sessionToken: null };
    USERS.push(newUser); saveUserToCloud(newUser);
    regCodeVal = null; toggleAuthMode('login'); document.getElementById('login-email').value = email; 
    showToast("Kayıt Başarılı! Giriş yapabilirsiniz.", "success");
}

function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim().toLowerCase(); const code = document.getElementById('forgot-code').value.trim(); const newPass = document.getElementById('forgot-new-pass').value;
    if(code !== forgotCodeVal || !forgotCodeVal) { showToast("Sıfırlama kodu hatalı/süresi dolmuş!", "error"); return; }
    if(newPass.length < 6) { showToast("Şifre en az 6 karakter olmalı.", "warning"); return; }

    let foundUser = USERS.find(u => u.email.toLowerCase() === email);
    if(foundUser) { foundUser.password = newPass; saveUserToCloud(foundUser); forgotCodeVal = null; toggleAuthMode('login'); showToast("Şifreniz sıfırlandı!", "success"); }
}

function handleLogin(e) {
    e.preventDefault(); hideAuthErrors();
    const email = document.getElementById('login-email').value.trim().toLowerCase(); const pass = document.getElementById('login-pass').value;
    if(BLACKLIST.includes(email)) { showAuthError('login-error-box', 'Hesabınız kalıcı olarak yasaklanmıştır!'); return; }
    
    let foundUser = USERS.find(u => u.email.toLowerCase() === email);
    if (!foundUser) { showAuthError('login-error-box', 'Hesap bulunamadı!'); return; }
    if (foundUser.password !== pass) { showAuthError('login-error-box', 'Hatalı şifre.'); return; }

    sessionToken = "TOK_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    foundUser.sessionToken = sessionToken; foundUser.lastActive = Date.now();
    
    currentUser = foundUser; 
    saveSessionLocally(); 
    localStorage.setItem('mavitarif_loginTime', Date.now().toString()); // ZAMANLAYICIYI BURADA BAŞLATIYORUZ
    
    const roleName = currentUser.customRole || (currentUser.role === 'admin' ? 'Baş Şef' : 'Kullanıcı');
    finalizeLogin(`${currentUser.name} (${roleName}) olarak giriş yapıldı.`);
}

function handleGuestLogin() {
    hideAuthErrors();
    currentUser = { email: 'misafir_' + Date.now() + '@mavitarif.local', name: 'Misafir Kullanıcı', role: 'guest', customRole: 'Ziyaretçi', avatar: null, bio: 'Sadece tariflere göz atıyorum.' };
    finalizeLogin(`Misafir modunda giriş yapıldı. Sadece okuma yetkiniz var.`);
}

window.upgradeGuestAccount = function(e) {
    e.preventDefault();
    const email = document.getElementById('upgrade-email').value.trim().toLowerCase(); const pass = document.getElementById('upgrade-pass').value; const code = document.getElementById('upgrade-code').value.trim();
    const secQ = document.getElementById('upgrade-security-question').value; const secA = document.getElementById('upgrade-security-answer').value.trim();
    if(code !== regCodeVal || !regCodeVal) { showToast("Hatalı veya süresi dolmuş doğrulama kodu!", "error"); return; }
    if(pass.length < 6) { showToast("Şifreniz en az 6 karakter olmalıdır.", "warning"); return; }
    if(USERS.find(u => u.email.toLowerCase() === email)) { showToast("Bu e-posta zaten sistemde kayıtlı!", "error"); return; }
    if(BLACKLIST.includes(email)) { showToast("Bu e-posta yasaklanmıştır!", "error"); return; }

    sessionToken = "TOK_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    currentUser.email = email; currentUser.password = pass; currentUser.name = email.split('@')[0]; currentUser.role = 'user'; currentUser.customRole = 'Kullanıcı'; currentUser.securityQ = secQ; currentUser.securityA = secA; currentUser.sessionToken = sessionToken; currentUser.lastActive = Date.now();
    USERS.push(currentUser); saveUserToCloud(currentUser); saveSessionLocally(); regCodeVal = null; 
    showToast("Tebrikler! Hesabınız başarıyla kalıcı üyeliğe yükseltildi.", "success"); applyAuthUI(); goPage('dash', document.getElementById('nav-dash'));
}

async function finalizeLogin(msg) {
    showToast(msg, "success");
    document.getElementById('auth-screen').style.display = 'none'; document.getElementById('main-app-container').style.display = 'flex'; 
    
    const aiBox = document.getElementById('aiMessages');
    if(aiBox) aiBox.innerHTML = '<div class="msg ai"><div class="msg-bubble">Şefim selam! Reçeteler ve mutfak durumu hafızamda. Bana komut ver!</div></div>';

    applyAuthUI();
    if(currentUser && currentUser.role !== 'guest') {
        const notebookData = await safeFetch('notebook', q => q.select('*').eq('user_email', currentUser.email));
        if(notebookData.length > 0) NOTEBOOK_IDS = notebookData.map(n => n.recipe_id);
        if(window.supabaseClient) await supabaseClient.from('users').update({ session_token: sessionToken, last_active: Date.now() }).eq('email', currentUser.email);
        await logAdminAction("Sisteme giriş yaptı.");
    }
    await cleanupOldData(); initApp();
}

function logOut() {
    if(currentUser && currentUser.role !== 'guest') {
        logAdminAction("Sistemden güvenli çıkış yaptı.");
        if(window.supabaseClient) supabaseClient.from('users').update({ session_token: null, last_active: 0 }).eq('email', currentUser.email).then();
    }
    currentUser = null; sessionToken = null; NOTEBOOK_IDS = []; 
    
    const aiBox = document.getElementById('aiMessages');
    if(aiBox) aiBox.innerHTML = '<div class="msg ai"><div class="msg-bubble">Şefim selam! Reçeteler ve mutfak durumu hafızamda. Bana komut ver!</div></div>';

    localStorage.removeItem('mavitarif_currentUser'); localStorage.removeItem('mavitarif_sessionToken');
    if(document.getElementById('main-app-container')) document.getElementById('main-app-container').style.display = 'none'; 
    if(document.getElementById('auth-screen')) document.getElementById('auth-screen').style.display = 'flex'; 
    if(typeof toggleAuthMode === 'function') toggleAuthMode('login'); 
    if(typeof hideAuthErrors === 'function') hideAuthErrors(); 
    if(typeof showToast === 'function') showToast("Güvenli çıkış yapıldı.", "info");
}

let userLimit = 10; let blacklistLimit = 10;

function handleAddAdmin(e) {
    e.preventDefault(); if(currentUser.role !== 'admin') return;
    const name = document.getElementById('admin-add-name').value.trim(); const email = document.getElementById('admin-add-email').value.trim().toLowerCase(); const pass = document.getElementById('admin-add-pass').value;
    if(USERS.find(u => u.email.toLowerCase() === email)) { showToast("Bu e-posta zaten sistemde kayıtlı!", "error"); return; } 
    if(BLACKLIST.includes(email)) { showToast("Bu e-posta adresi kara listede! Önce kara listeden çıkarın.", "warning"); return; }
    
    const newAdmin = { name: name, email: email, password: pass, role: 'admin', customRole: 'Baş Şef', bio: 'Mutfakta kriz yok, planlama var! 👨‍🍳', avatar: null, securityQ: null, securityA: null, lastActive: null, sessionToken: null }; 
    USERS.push(newAdmin); saveUserToCloud(newAdmin); renderUserManagement(); document.getElementById('addAdminForm').reset();
    logAdminAction(`"${name}" (${email}) adlı kişiyi sisteme yönetici olarak ekledi.`); showToast(`Sisteme başarıyla yeni bir yetkili şef eklendi!`, "success");
}

function renderUserManagement() {
    const usersTbody = document.getElementById('users-table-body'); const blacklistTbody = document.getElementById('blacklist-table-body');
    if(!usersTbody || !blacklistTbody || currentUser.role !== 'admin') return;

    const searchQ = document.getElementById('user-search-input') ? document.getElementById('user-search-input').value.toLowerCase() : '';
    let filteredUsers = USERS.filter(u => u.name.toLowerCase().includes(searchQ) || u.email.toLowerCase().includes(searchQ) || (u.customRole && u.customRole.toLowerCase().includes(searchQ)));
    const displayedUsers = filteredUsers.slice(0, userLimit); const now = Date.now();

    usersTbody.innerHTML = displayedUsers.map(u => { 
        const displayRole = u.customRole || (u.role === 'admin' ? 'Baş Şef' : 'Kullanıcı');
        let actionsHtml = ''; 
        const inspectBtn = `<button type="button" class="btn-submit-green" style="padding: 6px 10px; font-size:12px; margin-right:5px; background:var(--wp-green);" onclick="openUserDetailModal('${u.email}')">👤 İncele / Mesaj</button>`;
        const isOnline = u.lastActive && (now - u.lastActive < 65000);
        const statusHtml = isOnline ? `<div style="color:var(--green); font-weight:800; font-size:11px; margin-top:4px; display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; background:var(--green); border-radius:50%; display:inline-block; box-shadow: 0 0 5px var(--green);"></span> Çevrimiçi</div>` : `<div style="color:var(--text-muted); font-weight:700; font-size:11px; margin-top:4px; display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; background:#cbd5e1; border-radius:50%; display:inline-block;"></span> Çevrimdışı</div>`;

        if(u.email.toLowerCase() === currentUser.email.toLowerCase()) { 
            actionsHtml = `${inspectBtn} <button type="button" class="btn-cancel-blue" style="padding: 6px 10px; font-size:12px; margin-right:5px;" onclick="openEditRoleModal('${u.email}', '${displayRole}')">Unvan Düzenle</button> <span style="font-size:12px; color:var(--text-muted); font-weight:bold;">Bu Sensin</span>`; 
        } else if (u.role === 'admin') { 
            if (currentUser.email.toLowerCase() === MASTER_ADMIN.toLowerCase()) { actionsHtml = `${inspectBtn} <button type="button" class="btn-cancel-blue" style="padding: 6px 10px; font-size:12px; margin-right:5px;" onclick="openEditRoleModal('${u.email}', '${displayRole}')">Unvan Düzenle</button> <button type="button" class="btn-cancel-blue" style="padding: 6px 10px; font-size:12px; margin-right:5px;" onclick="deleteUser('${u.email}')">Kalıcı Sil</button> <button type="button" class="btn-submit-green" style="padding: 6px 10px; font-size:12px; background:var(--red);" onclick="banUser('${u.email}')">Dondur (Ban)</button>`; } 
            else { actionsHtml = `${inspectBtn} <span style="font-size:12px; color:var(--amber); font-weight:bold; margin-left:10px;">Diğer Yöneticilere Yetki Yok</span>`; } 
        } else { actionsHtml = `${inspectBtn} <button type="button" class="btn-cancel-blue" style="padding: 6px 10px; font-size:12px; margin-right:5px;" onclick="openEditRoleModal('${u.email}', '${displayRole}')">Unvan Düzenle</button> <button type="button" class="btn-cancel-blue" style="padding: 6px 10px; font-size:12px; margin-right:5px;" onclick="deleteUser('${u.email}')">Kalıcı Sil</button> <button type="button" class="btn-submit-green" style="padding: 6px 10px; font-size:12px; background:var(--red);" onclick="banUser('${u.email}')">Dondur (Ban)</button>`; } 
        
        return `<tr><td><strong style="color:var(--bg-dark);">${u.name}</strong>${statusHtml}</td><td>${u.email}</td><td><span class="badge-stock ${u.role === 'admin' ? 'warning' : 'ok'}">${displayRole}</span></td><td style="text-align:center;">${actionsHtml}</td></tr>`; 
    }).join('');
    
    const btnMoreUsers = document.getElementById('btn-load-more-users');
    btnMoreUsers.style.display = filteredUsers.length > userLimit ? 'inline-block' : 'none'; 
    
    const displayedBlacklist = BLACKLIST.slice(0, blacklistLimit);
    if(BLACKLIST.length === 0) blacklistTbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:var(--text-muted);">Kara listede kimse yok.</td></tr>`; 
    else blacklistTbody.innerHTML = displayedBlacklist.map(email => `<tr><td><strong>${email}</strong></td><td style="text-align:center;"><button type="button" class="btn-submit-green" style="padding: 6px 10px; font-size:12px;" onclick="unbanUser('${email}')">Affet / Yasağı Kaldır</button></td></tr>`).join(''); 
    
    const btnMoreBlacklist = document.getElementById('btn-load-more-blacklist');
    btnMoreBlacklist.style.display = BLACKLIST.length > blacklistLimit ? 'inline-block' : 'none'; 
}

function loadMoreUsers() { userLimit += 10; renderUserManagement(); }
function loadMoreBlacklist() { blacklistLimit += 10; renderUserManagement(); }

function openUserDetailModal(email) {
    const u = USERS.find(x => x.email.toLowerCase() === email.toLowerCase()); if(!u) return;
    document.getElementById('ud-name').textContent = u.name; document.getElementById('ud-role').textContent = u.customRole || (u.role === 'admin' ? 'Baş Şef' : 'Kullanıcı');
    document.getElementById('ud-avatar').src = u.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&q=80';
    document.getElementById('dm-email').value = u.email;
    
    // Kendi kendine mesaj atma engeli (Form butonu devre dışı bırakılır)
    const dmBtn = document.querySelector('#dmForm button[type="submit"]');
    if(dmBtn) {
        if(u.email.toLowerCase() === currentUser.email.toLowerCase()) {
            dmBtn.disabled = true; dmBtn.innerText = "Kendinize Mesaj Atamazsınız"; dmBtn.style.background = "#94a3b8";
        } else {
            dmBtn.disabled = false; dmBtn.innerText = "Mesajı Gönder"; dmBtn.style.background = "var(--primary)";
        }
    }
    
    let logsContainer = document.getElementById('dynamic-user-logs');
    if(!logsContainer) {
        logsContainer = document.createElement('div');
        logsContainer.id = 'dynamic-user-logs';
        document.getElementById('ud-header').after(logsContainer);
    }
    
    if (currentUser.role === 'admin') {
        const uLogs = AUDIT_LOG.filter(l => (l.user_email || "").toLowerCase() === u.email.toLowerCase() || (l.admin_email || "").toLowerCase() === u.email.toLowerCase());
        const logsHtml = uLogs.length > 0 
            ? uLogs.map(l => `<li style="padding-bottom: 4px; border-bottom: 1px dashed #cbd5e1; margin-bottom: 4px;">[${l.log_date || l.created_at || new Date(l.id).toLocaleString('tr-TR')}] ${l.action}</li>`).join('') 
            : '<li>Sistemde henüz bir işlem kaydı yok.</li>';
        
        logsContainer.innerHTML = `<h4 style="color:#0f172a; margin-bottom:5px; font-size:13px;">Kullanıcı Son Hareketleri (Log):</h4><ul style="font-size:12px; color:#475569; padding-left:15px; max-height:100px; overflow-y:auto; margin-bottom:15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">${logsHtml}</ul>`;
        logsContainer.style.display = 'block';
    } else {
        logsContainer.style.display = 'none';
    }

    if (currentUser.email.toLowerCase() === MASTER_ADMIN.toLowerCase()) {
        document.getElementById('super-admin-zone').style.display = 'block';
        document.getElementById('ud-email').textContent = u.email;
        document.getElementById('ud-pass').textContent = '••••••••'; document.getElementById('ud-pass').dataset.realpass = u.password;
        document.getElementById('ud-security-q').textContent = u.securityQ || 'Belirtilmemiş';
        document.getElementById('ud-security-a').textContent = u.securityA || 'Belirtilmemiş';
    } else document.getElementById('super-admin-zone').style.display = 'none';
    
    document.getElementById('user-detail-modal').style.display = 'block';
}

function closeUserDetailModal() { document.getElementById('user-detail-modal').style.display = 'none'; }
function toggleUdPass() { const passEl = document.getElementById('ud-pass'); passEl.textContent = passEl.textContent === '••••••••' ? passEl.dataset.realpass : '••••••••'; }
function openSuperAdminPassModal() { document.getElementById('sa-pass-email').value = document.getElementById('ud-email').textContent; document.getElementById('sa-new-pass').value = ''; document.getElementById('super-admin-pass-modal').style.display = 'block'; }
function closeSuperAdminPassModal() { document.getElementById('super-admin-pass-modal').style.display = 'none'; }

function submitSuperAdminPass() {
    const email = document.getElementById('sa-pass-email').value; const newPass = document.getElementById('sa-new-pass').value;
    if(newPass.length < 6) { showToast("Şifre en az 6 haneli olmalıdır.", "warning"); return; }
    let targetUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if(targetUser) {
        targetUser.password = newPass; saveUserToCloud(targetUser); document.getElementById('ud-pass').dataset.realpass = newPass;
        logAdminAction(`"${targetUser.name}" kullanıcısının şifresini değiştirdi.`);
        showToast("Kullanıcının şifresi başarıyla değiştirildi!", "success"); closeSuperAdminPassModal();
    }
}
// ==========================================
// MAVİTARİF PRO - İLETİŞİM, DESTEK VE KİLER MOTORU (BÖLÜM 3/4)
// ==========================================

window.switchDmTab = function(tab) {
    currentDmTab = tab;
    document.querySelectorAll('.dm-tab').forEach(el => { el.classList.remove('active'); el.style.color = 'var(--text-muted)'; });
    const activeBtn = document.getElementById(`tab-dm-${tab}`);
    if(activeBtn) { activeBtn.classList.add('active'); activeBtn.style.color = 'var(--primary)'; }
    renderUserDMs();
};

window.renderUserDMs = function() {
    const box = document.getElementById('user-dms-list');
    if(!box || !currentUser) return; 

    if(currentUser.role === 'guest') {
        box.innerHTML = '<div class="empty-state" style="border: 1px solid var(--amber); color: var(--amber);">Misafir hesaplarının mesaj veya destek paneline erişim yetkisi yoktur. Lütfen profil sayfasından kalıcı üyeliğe geçin.</div>';
        return;
    }
    
    // 💡 HTML DEĞİŞTİRMEDEN DİNAMİK SEKME ADI: Yöneticiyse "Gönderilen", Değilse "Gelen" yazacak.
    const tabInboxBtn = document.getElementById('tab-dm-inbox');
    if(tabInboxBtn) {
        if(currentUser.role === 'admin') tabInboxBtn.innerText = "📤 Gönderilen Mesajlar";
        else tabInboxBtn.innerText = "📩 Gelen Mesajlar";
    }
    const tabSupportBtn = document.getElementById('tab-dm-support');
    if(tabSupportBtn) {
        if(currentUser.role === 'admin') tabSupportBtn.innerText = "🚨 Gelen Destek Talepleri";
        else tabSupportBtn.innerText = "🛠️ Destek Taleplerim";
    }

    const searchQ = (document.getElementById('dm-search-input') ? document.getElementById('dm-search-input').value : '').toLowerCase();
    let displayedItems = [];
    const myEmail = currentUser.email.toLowerCase();

    if (currentDmTab === 'support') {
        if (currentUser.role === 'admin') {
            // YÖNETİCİ: Sadece kullanıcılardan gelen destek taleplerini görsün.
            let incomingSupport = DIRECT_MESSAGES.filter(dm => dm.is_support === true && (dm.to_email || dm.toEmail || "").toLowerCase() === myEmail);
            displayedItems = [...incomingSupport].sort((a, b) => parseInt(a.id.split('_')[1] || 0) - parseInt(b.id.split('_')[1] || 0));
        } else {
            // KULLANICI: Yolladığı destek talepleri VEYA ona gelen "YÖNETİM YANITI" mesajları (Aynı kalsın kuralı)
            let mySupportDMs = DIRECT_MESSAGES.filter(dm => {
                const to = (dm.to_email || dm.toEmail || "").toLowerCase();
                const from = (dm.from_email || dm.fromEmail || "").toLowerCase();
                return dm.is_support === true && (from === myEmail || to === myEmail);
            });
            displayedItems = [...mySupportDMs].sort((a, b) => parseInt(a.id.split('_')[1] || 0) - parseInt(b.id.split('_')[1] || 0));
        }
    } else if (currentDmTab === 'inbox') {
        if (currentUser.role === 'admin') {
            // YÖNETİCİ: Yolladığı tüm mesajlar (Normal Özel Mesaj + Yönetim Yanıtları)
            let sentDMs = DIRECT_MESSAGES.filter(dm => {
                const from = (dm.from_email || dm.fromEmail || "").toLowerCase();
                return from === myEmail;
            });
            displayedItems = [...sentDMs].sort((a, b) => parseInt(a.id.split('_')[1] || 0) - parseInt(b.id.split('_')[1] || 0));
        } else {
            // KULLANICI: Gelen normal mesajlar (Destek harici)
            let myDMs = DIRECT_MESSAGES.filter(dm => {
                const to = (dm.to_email || dm.toEmail || "").toLowerCase();
                return to === myEmail && dm.is_support === false;
            });
            displayedItems = [...myDMs].sort((a, b) => parseInt(a.id.split('_')[1] || 0) - parseInt(b.id.split('_')[1] || 0));
        }
    }

    if(searchQ) {
        displayedItems = displayedItems.filter(item => 
            (item.subject && item.subject.toLowerCase().includes(searchQ)) || 
            (item.text && item.text.toLowerCase().includes(searchQ)) ||
            (item.from_name && item.from_name.toLowerCase().includes(searchQ)) ||
            ((item.from_email || item.fromEmail) && (item.from_email || item.fromEmail).toLowerCase().includes(searchQ))
        );
    }

    if(displayedItems.length === 0) { box.innerHTML = `<div class="empty-state">Bu sekmede herhangi bir kayıt bulunmuyor.</div>`; return; }
    
    const paginatedItems = displayedItems.reverse().slice(0, dmLimit);
    box.innerHTML = paginatedItems.map(item => {
        const isRead = item.isRead === true || item.is_read === true; 
        const fromName = item.from_name || item.from || "Bilinmiyor";
        const fromEmail = item.from_email || item.fromEmail || "";
        const toEmail = item.to_email || item.toEmail || "";
        const isSupportMessage = item.is_support === true;
        const isSupportReply = isSupportMessage && item.subject.startsWith("YÖNETİM YANITI:");
        
        let badgeHtml = '';
        let actionButtons = '';
        let bgStyle = '';
        let titlePrefix = '';
        let titleColor = '';

        if (currentUser.role === 'admin') {
            if (currentDmTab === 'support') {
                // Admin'e gelen destek talebi KIRMIZI widget olsun
                badgeHtml = !isRead 
                    ? `<button onclick="replySupportMessage('${item.id}')" style="background:var(--red); color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:bold; margin-right:5px;">Yanıtla</button><button onclick="markDmAsRead('${item.id}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:bold;">Kapat</button>` 
                    : `<span style="color:var(--green); font-size:12px; font-weight:700;">✓ İncelendi / Kapatıldı</span>`;
                bgStyle = !isRead ? 'background:#fef2f2; border-left: 4px solid var(--red);' : 'background:#f8fafc; border-left: 4px solid #94a3b8;';
                titlePrefix = '🚨 DESTEK TALEBİ';
                titleColor = !isRead ? 'var(--red)' : '#64748b';
            } else {
                // Admin'in Gönderdikleri (Hem Normal hem Yanıtlar)
                badgeHtml = isRead ? `<span style="color:var(--green); font-size:12px; font-weight:700;">✓ Kullanıcı Okudu</span>` : `<span style="color:var(--amber); font-size:12px; font-weight:700;">⏳ İletildi (Okunmadı)</span>`;
                actionButtons = isRead ? '' : `<button onclick="editSentMessage('${item.id}')" style="background:none; border:1px solid var(--primary); color:var(--primary); padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; margin-right:5px;">Düzenle</button><button onclick="withdrawMessage('${item.id}')" style="background:none; border:1px solid var(--red); color:var(--red); padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Geri Çek</button>`;
                bgStyle = isSupportReply ? 'background:#f0fdf4; border-left: 4px solid var(--green);' : 'background:#f8fafc; border-left: 4px solid var(--primary);';
                titlePrefix = 'GÖNDERİLEN MESAJ';
                titleColor = 'var(--bg-dark)';
            }
        } else {
            // KULLANICI GÖRÜNÜMÜ
            if (isSupportMessage) {
                if(isSupportReply) {
                    badgeHtml = !isRead 
                        ? `<button onclick="markDmAsRead('${item.id}')" style="background:var(--red); color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:bold;">Okundu İşaretle</button>` 
                        : `<span style="color:var(--red); font-size:12px; font-weight:700;">✓ Yönetim Mesajı (Okundu)</span>`;
                    // Kullanıcıya gelen yönetim yanıtı KIRMIZI widget olsun
                    bgStyle = !isRead ? 'background:#fef2f2; border-left: 4px solid var(--red);' : 'background:#fff5f5; border-left: 4px solid #fca5a5;';
                    titlePrefix = '🚨 DİKKAT YÖNETİM';
                    titleColor = 'var(--red)';
                } else {
                    badgeHtml = isRead ? `<span style="color:var(--green); font-size:12px; font-weight:700;">✓ Yönetim İnceledi</span>` : `<span style="color:var(--amber); font-size:12px; font-weight:700;">⏳ İnceleniyor...</span>`;
                    actionButtons = isRead ? '' : `<button onclick="editSupportMessage('${item.id}')" style="background:none; border:1px solid var(--primary); color:var(--primary); padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; margin-right:5px;">Düzenle</button><button onclick="withdrawMessage('${item.id}')" style="background:none; border:1px solid var(--red); color:var(--red); padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Geri Çek</button>`;
                    bgStyle = 'background:#fffbeb; border-left: 4px solid var(--amber);';
                    titlePrefix = 'TALEBİM';
                    titleColor = '#b45309';
                }
            } else {
                badgeHtml = !isRead 
                    ? `<button onclick="markDmAsRead('${item.id}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:bold;">Okundu İşaretle</button>` 
                    : `<span style="color:var(--green); font-size:12px; font-weight:700;">✓ Okundu</span>`;
                bgStyle = 'background:#f8fafc; border-left: 4px solid var(--primary);';
                titlePrefix = 'GELEN MESAJ';
                titleColor = 'var(--bg-dark)';
            }
        }

        let emailDisplay = '';
        if(currentUser.role === 'admin') {
            if (currentDmTab === 'inbox') emailDisplay = `Kime: ${toEmail}`;
            else emailDisplay = `Gönderen: ${fromName} ${fromEmail ? `(${fromEmail})` : ''}`;
        } else {
            if (isSupportMessage && !isSupportReply) emailDisplay = `Kime: Yönetim`;
            else emailDisplay = `Gönderen: ${fromName} ${fromEmail ? `(${fromEmail})` : ''}`;
        }

        return `
        <div class="dm-item ${!isRead ? 'unread' : ''}" style="${bgStyle} margin-bottom:12px; padding:18px; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:16px; font-weight:800; color:${titleColor};">[${titlePrefix}] ${item.subject}</span>
                <span style="font-size:12px; color:var(--text-muted);">${item.date}</span>
            </div>
            <div style="font-size:14px; color:var(--text-main); margin-bottom:15px; line-height:1.6;">${item.text.replace(/\n/g, "<br>")}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #cbd5e1; padding-top:10px; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap: 10px;">
                    <span style="font-size:13px; color:var(--text-muted); font-weight:700;">${emailDisplay}</span>
                    ${actionButtons}
                </div>
                ${badgeHtml}
            </div>
        </div>`;
    }).join('');

    if(displayedItems.length > dmLimit) {
        box.innerHTML += `<div style="text-align:center; margin-top:15px;"><button onclick="dmLimit += 15; renderUserDMs()" class="btn-cancel-blue" style="padding:8px 20px; font-size:13px;">⬇️ Devamını Göster</button></div>`;
    }
}

window.replySupportMessage = function(id) {
    const dm = DIRECT_MESSAGES.find(d => d.id === id);
    if(!dm) return;
    const replyText = prompt(`"${dm.subject}" talebine yanıtınız:`);
    if(!replyText) return;

    dm.isRead = true; dm.is_read = true;
    if(window.supabaseClient) supabaseClient.from('direct_messages').update({ is_read: true }).eq('id', id).then();

    const cleanSubject = dm.subject.replace("🚨 DESTEK TALEBİ: ", "").replace("TALEBİM: ", "");

    const newDM = {
        id: "DM_" + Date.now(),
        from_name: currentUser.name + " (Yönetim)",
        from_email: MASTER_ADMIN,
        to_email: (dm.from_email || dm.fromEmail || "").toLowerCase(),
        subject: "YÖNETİM YANITI: " + cleanSubject,
        text: replyText,
        date: new Date().toLocaleString('tr-TR'),
        is_read: false,
        is_support: true // YÖNETİCİ YANITI ARTIK DESTEK ZİNCİRİNE GİRECEK!
    };
    DIRECT_MESSAGES.push(newDM);
    if(window.supabaseClient) supabaseClient.from('direct_messages').insert([newDM]).then();
    
    logAdminAction(`"${dm.from_email}" adresinin destek talebine yanıt verdi.`);
    showToast("Yanıt gönderildi ve destek talebi kapatıldı.", "success");
    renderUserDMs(); updateBadges();
}

window.withdrawMessage = async function(id) {
    if(confirm("Bu mesajı kalıcı olarak geri çekmek (silmek) istediğinize emin misiniz?")) {
        DIRECT_MESSAGES = DIRECT_MESSAGES.filter(dm => dm.id !== id);
        if(window.supabaseClient) await supabaseClient.from('direct_messages').delete().eq('id', id);
        if(currentUser.role === 'admin') logAdminAction("Gönderdiği bir mesajı geri çekti.");
        showToast("Mesaj başarıyla geri çekildi.", "info");
        renderUserDMs(); updateBadges();
    }
}

window.editSupportMessage = function(id) {
    const dm = DIRECT_MESSAGES.find(d => d.id === id);
    if(dm) {
        editingSupportId = id; 
        document.getElementById('sup-subject').value = dm.subject;
        document.getElementById('sup-text').value = dm.text;
        openSupportModal();
    }
}

window.editSentMessage = function(id) {
    const dm = DIRECT_MESSAGES.find(d => d.id === id);
    if(dm && !dm.isRead) {
        const newText = prompt("Gönderilen mesajınızı düzenleyin:", dm.text);
        if(newText !== null && newText.trim() !== "") {
            dm.text = newText.trim();
            if(window.supabaseClient) supabaseClient.from('direct_messages').update({ text: dm.text }).eq('id', id).then();
            if(currentUser.role === 'admin') logAdminAction(`Gönderdiği bir mesajı düzenledi.`);
            showToast("Mesajınız güncellendi!", "success");
            renderUserDMs();
        }
    }
}

window.submitSupportMessage = function() {
    if(!checkSpamProtection('send_support')) return; 
    if(currentUser.role === 'guest') { showToast("Misafirler destek talebi gönderemez.", "warning"); return; }
    if(currentUser.role === 'admin') { showToast("Yöneticiler destek talebi gönderemez.", "warning"); return; }
    
    const subject = document.getElementById('sup-subject').value.trim();
    const text = document.getElementById('sup-text').value.trim();
    if(!subject || !text) return;

    const btn = document.querySelector('#supportForm button[type="submit"]');
    if(btn) btn.disabled = true;

    if (editingSupportId) {
        const dm = DIRECT_MESSAGES.find(d => d.id === editingSupportId);
        if(dm) {
            dm.subject = subject; dm.text = text; dm.isRead = false; dm.is_read = false;
            if(window.supabaseClient) supabaseClient.from('direct_messages').update({ subject: subject, text: text, is_read: false }).eq('id', editingSupportId).then();
            showToast("Destek talebiniz başarıyla güncellendi!", "success");
        }
        editingSupportId = null;
    } else {
        const newDM = { 
            id: "DM_" + Date.now(), 
            from_name: currentUser.name, 
            from_email: currentUser.email.toLowerCase(),
            to_email: MASTER_ADMIN.toLowerCase(), 
            subject: subject, 
            text: text, 
            date: new Date().toLocaleString('tr-TR'), 
            is_read: false,
            is_support: true
        };
        DIRECT_MESSAGES.push(newDM);
        if(window.supabaseClient) supabaseClient.from('direct_messages').insert([newDM]).then();
        showToast("Destek talebiniz başarıyla yönetime iletildi!", "success");
    }

    document.getElementById('supportForm').reset();
    closeSupportModal();
    if(btn) btn.disabled = false;
    if(document.getElementById('page-dms').classList.contains('active')) renderUserDMs();
}

window.openSupportModal = function() {
    if(currentUser && currentUser.role === 'guest') { showToast("Destek sistemini kullanmak için hesabınızı yükseltin.", "warning"); return; }
    if(currentUser && currentUser.role === 'admin') { showToast("Yöneticiler kendi kendilerine destek talebi gönderemez.", "warning"); return; }
    document.getElementById('support-modal').style.display = 'block';
}
window.closeSupportModal = function() { 
    editingSupportId = null; 
    document.getElementById('supportForm').reset();
    document.getElementById('support-modal').style.display = 'none'; 
}

window.markDmAsRead = function(id) {
    const dm = DIRECT_MESSAGES.find(d => d.id === id);
    if(dm) {
        dm.isRead = true; dm.is_read = true;
        if(window.supabaseClient) supabaseClient.from('direct_messages').update({ is_read: true }).eq('id', id).then();
        renderUserDMs(); updateBadges();
    }
}

function sendDirectMessage() {
    if(!checkSpamProtection('send_dm')) return; 
    if(currentUser.role === 'guest') { showToast("Misafirler özel mesaj gönderemez.", "warning"); return; }

    const btn = document.querySelector('#dmForm button[type="submit"]');
    if(btn) btn.disabled = true;

    const toEmail = document.getElementById('dm-email').value.trim().toLowerCase();
    const subject = document.getElementById('dm-subject').value.trim();
    const text = document.getElementById('dm-text').value.trim();
    
    if(toEmail === currentUser.email.toLowerCase()) {
        showToast("Hata: Kendinize mesaj yollayamazsınız, bu zaten sensin!", "error");
        if(btn) btn.disabled = false;
        return;
    }
    
    if(!toEmail || !subject || !text) { if(btn) btn.disabled = false; return; }

    const newDM = { 
        id: "DM_" + Date.now(), 
        from_name: currentUser.name, 
        from_email: currentUser.email.toLowerCase(),
        to_email: toEmail, 
        subject: subject, 
        text: text, 
        date: new Date().toLocaleString('tr-TR'), 
        is_read: false,
        is_support: false
    };
    DIRECT_MESSAGES.push(newDM);
    
    if(window.supabaseClient) supabaseClient.from('direct_messages').insert([newDM]).then();
    logAdminAction(`"${toEmail}" adresine özel mesaj gönderdi.`);
    showToast("Özel mesaj başarıyla iletildi!", "success");
    document.getElementById('dmForm').reset();
    closeUserDetailModal();
    if(btn) btn.disabled = false;
    if(document.getElementById('page-dms').classList.contains('active')) renderUserDMs();
}

window.openEditRoleModal = function(email, currentRole) { document.getElementById('edit-role-email').value = email; document.getElementById('edit-role-input').value = currentRole; document.getElementById('edit-role-modal').style.display = 'block'; }
window.closeEditRoleModal = function() { document.getElementById('edit-role-modal').style.display = 'none'; }
window.submitEditRole = function(e) {
    e.preventDefault(); const email = document.getElementById('edit-role-email').value.trim().toLowerCase(); const newRole = document.getElementById('edit-role-input').value.trim();
    const user = USERS.find(u => u.email.toLowerCase() === email);
    if(user) { user.customRole = newRole; saveUserToCloud(user); renderUserManagement(); logAdminAction(`"${user.name}" kullanıcısının unvanını "${newRole}" olarak güncelledi.`); showToast("Unvan güncellendi!", "success"); }
    closeEditRoleModal();
}

function deleteUser(email) { 
    const targetEmail = email.toLowerCase();
    if(confirm(`DİKKAT: ${targetEmail} adresli kullanıcıyı tamamen silmek istiyor musunuz?`)) { 
        USERS = USERS.filter(u => u.email.toLowerCase() !== targetEmail); deleteUserFromCloud(targetEmail); renderUserManagement(); 
        logAdminAction(`"${targetEmail}" adresli kullanıcıyı sistemden KALICI olarak sildi.`); showToast("Kullanıcı silindi.", "success");
    } 
}

function banUser(email) { 
    const targetEmail = email.toLowerCase();
    if(confirm(`${targetEmail} adresli kullanıcının erişimini dondurmak istediğinize emin misiniz?`)) { 
        USERS = USERS.filter(u => u.email.toLowerCase() !== targetEmail); deleteUserFromCloud(targetEmail); 
        if(!BLACKLIST.includes(targetEmail)) { BLACKLIST.push(targetEmail); saveBlacklistToCloud(targetEmail); } 
        renderUserManagement(); logAdminAction(`"${targetEmail}" adresli kullanıcının erişimini dondurdu (KARA LİSTE).`); showToast("Kullanıcı kara listeye alındı.", "error");
    } 
}

function unbanUser(email) { 
    const targetEmail = email.toLowerCase();
    if(confirm(`${targetEmail} adresli kullanıcının yasağını kaldırmak istiyor musunuz?`)) { 
        BLACKLIST = BLACKLIST.filter(e => e !== targetEmail); deleteBlacklistFromCloud(targetEmail); 
        renderUserManagement(); logAdminAction(`"${targetEmail}" adresli kullanıcının yasağını kaldırdı (Affetti).`); showToast("Yasak kaldırıldı.", "success");
    } 
}

function handleFridgeSearchInput(e) { 
    const val = e.target.value.trim().toLowerCase(); const suggBox = document.getElementById('fridge-suggestions');
    if(!val) { suggBox.style.display = 'none'; return; } 
    let filtered = INGREDIENTS_DB.filter(ing => ing.toLowerCase().includes(val));
    if(!filtered.find(ing => ing.toLowerCase() === val)) filtered.unshift(e.target.value.trim());
    suggBox.innerHTML = filtered.slice(0, 10).map(ing => `<div class="fridge-suggestion-item" onclick="addFridgeTag('${ing.replace(/'/g, "\\'")}')">${ing}</div>`).join('');
    suggBox.style.display = 'block';
}

function handleFridgeSearchKeydown(e) { if(e.key === 'Enter') { e.preventDefault(); const val = e.target.value.trim(); if(val) addFridgeTag(val); } }
function addFridgeTag(name) { if(!selectedFridgeTags.includes(name)) selectedFridgeTags.push(name); document.getElementById('fridge-search-input').value = ''; document.getElementById('fridge-suggestions').style.display = 'none'; renderFridgeTags(); runWhatIHave(); }
function removeFridgeTag(name) { selectedFridgeTags = selectedFridgeTags.filter(t => t !== name); renderFridgeTags(); runWhatIHave(); }
function renderFridgeTags() { const box = document.getElementById('fridge-selected-tags'); box.innerHTML = selectedFridgeTags.map(tag => `<div class="fridge-tag">${tag} <div class="fridge-tag-remove" onclick="removeFridgeTag('${tag.replace(/'/g, "\\'")}')">✖</div></div>`).join(''); }
function clearFridgeSelection() { selectedFridgeTags = []; renderFridgeTags(); runWhatIHave(); showToast("Arama temizlendi.", "info"); }
function normalizeWord(str) { return str.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c'); }

function runWhatIHave() {
    const box = document.getElementById('whatihave-results'); if(!box) return;
    if(selectedFridgeTags.length === 0) { box.innerHTML = `<div class="empty-state">Malzeme eklediğinizde otomatik çalışacaktır.</div>`; return; }
    
    let matchedWithPercentage = []; const searchSynonyms = selectedFridgeTags.map(t => normalizeWord(t));
    RECIPES.forEach(r => { 
        if(r.status === 'pending' || !r.ingredients || r.ingredients.length === 0) return; 
        let matchCount = 0; 
        r.ingredients.forEach(ing => { const ingName = normalizeWord(ing.name); if(searchSynonyms.some(syn => ingName.includes(syn) || syn.includes(ingName))) matchCount++; }); 
        const matchPercent = Math.round((matchCount / r.ingredients.length) * 100); 
        if(matchPercent > 0) matchedWithPercentage.push({ recipe: r, percent: matchPercent }); 
    });
    matchedWithPercentage.sort((a, b) => b.percent - a.percent);
    
    if(matchedWithPercentage.length === 0) box.innerHTML = `<div class="empty-state">Eşleşen reçete bulunamadı.</div>`;
    else box.innerHTML = matchedWithPercentage.map(item => { 
        let cardHtml = makeRecipeCard(item.recipe); let color = item.percent >= 80 ? 'var(--green)' : (item.percent >= 50 ? 'var(--amber)' : 'var(--red)'); 
        let matchBadge = `<div style="position:absolute; top:15px; left:15px; z-index:10; background:${color}; color:white; padding:5px 10px; border-radius:8px; font-weight:800; font-size:12px; box-shadow:0 4px 10px rgba(0,0,0,0.2);">🎯 %${item.percent} Uyumlu</div>`; 
        return cardHtml.replace('<div class="recipe-card"', `<div class="recipe-card" style="position:relative;"`).replace('<div class="rc-actions">', matchBadge + '<div class="rc-actions">'); 
    }).join('');
}
document.addEventListener('click', function(e) { const suggBox = document.getElementById('fridge-suggestions'); if(suggBox && e.target.id !== 'fridge-search-input') suggBox.style.display = 'none'; });
// ==========================================
// 📦 STOK, KÜTÜPHANE VE PANEL YÖNETİMİ (BÖLÜM 4/4)
// ==========================================
function renderStockTable() {
    const b = document.getElementById('stock-table-body'); if(!b || currentUser.role !== 'admin') return;
    b.innerHTML = STOCK_ITEMS.map(i => { let alarmBadge = i.qty <= i.min ? `<span class="badge-stock risk">🔴 Yetersiz</span>` : (i.qty <= i.min * 1.5 ? `<span class="badge-stock warning">🟡 Riskli</span>` : `<span class="badge-stock ok">✅ Yeterli</span>`); return `<tr><td><strong>${i.name}</strong></td><td><input type="number" class="ing-edit-input" style="width:80px;padding:6px;" value="${i.qty}" min="0" onchange="updateStockQtyInline('${i.name}',this.value)"></td><td><input type="number" class="ing-edit-input" style="width:80px;padding:6px;" value="${i.min}" min="0" onchange="updateStockMinInline('${i.name}',this.value)"></td><td>${alarmBadge}</td><td style="text-align:center;"><button type="button" class="btn-ing-delete" onclick="deleteStockItem('${i.name}')" style="margin:auto;">🗑️</button></td></tr>`; }).join('');
    updateCriticalCountBadge();
}
function handleStockEntry(e) { 
    e.preventDefault(); if(currentUser.role !== 'admin') return;
    const name = document.getElementById('stock-name').value.trim(); const qty = parseFloat(document.getElementById('stock-qty').value) || 0; const min = parseFloat(document.getElementById('stock-min').value) || 0; 
    if(!name) return; let newItem = null;
    const existingIdx = STOCK_ITEMS.findIndex(item => item.name.toLowerCase() === name.toLowerCase()); 
    if(existingIdx > -1) { STOCK_ITEMS[existingIdx].qty = qty; STOCK_ITEMS[existingIdx].min = min; newItem = STOCK_ITEMS[existingIdx]; } else { newItem = { name, qty, min }; STOCK_ITEMS.push(newItem); } 
    saveStockToCloud(newItem); renderStockTable(); document.getElementById('stockForm').reset(); logAdminAction(`"${name}" malzemesi stok tablosuna kaydedildi.`); showToast(`"${name}" stoğu güncellendi!`, "success"); 
}
function updateStockQtyInline(name, value) { if(currentUser.role !== 'admin') return; const item = STOCK_ITEMS.find(i => i.name === name); if(item) { item.qty = parseFloat(value) || 0; saveStockToCloud(item); renderStockTable(); logAdminAction(`"${name}" stoğunu ${item.qty} yaptı.`); } }
function updateStockMinInline(name, value) { if(currentUser.role !== 'admin') return; const item = STOCK_ITEMS.find(i => i.name === name); if(item) { item.min = parseFloat(value) || 0; saveStockToCloud(item); renderStockTable(); } }
function deleteStockItem(name) { if(currentUser.role !== 'admin') return; if(confirm(`"${name}" silinsin mi?`)) { STOCK_ITEMS = STOCK_ITEMS.filter(i => i.name !== name); deleteStockFromCloud(name); renderStockTable(); showToast("Ürün silindi.", "success"); } }
function updateCriticalCountBadge() { let criticalCount = 0; STOCK_ITEMS.forEach(i => { if(i.qty <= i.min) criticalCount++; }); const critCard = document.getElementById('dash-critical-count'); if(critCard) critCard.textContent = `${criticalCount} Ürün Riskte`; }

function renderDash() { 
    const grid = document.getElementById('dash-recipes-grid'); if(!grid) return;
    let filtered = RECIPES.filter(r => r.status !== 'pending');
    if(!activeCategories.includes('all')) filtered = filtered.filter(r => r.cat && r.cat.some(c => activeCategories.includes(c)));
    if(filtered.length === 0) grid.innerHTML = `<div class="empty-state">Bu kategoride aktif reçete bulunamadı.</div>`; else grid.innerHTML = filtered.map(r => makeRecipeCard(r)).join('');
    const countEl = document.getElementById('dash-recipe-count'); if(countEl) countEl.textContent = `${RECIPES.filter(r => r.status !== 'pending').length} Reçete`; 
}
function filterDashCategory(element, cat) { 
    if (cat === 'all') { activeCategories = ['all']; document.querySelectorAll('#dash-category-row .chip').forEach(c => c.classList.remove('active')); element.classList.add('active'); } else { 
        if (activeCategories.includes('all')) { activeCategories = []; document.querySelector('#dash-category-row .chip[onclick*="all"]').classList.remove('active'); } 
        const index = activeCategories.indexOf(cat); if (index > -1) { activeCategories.splice(index, 1); element.classList.remove('active'); } else { activeCategories.push(cat); element.classList.add('active'); } 
        if (activeCategories.length === 0) { activeCategories = ['all']; document.querySelector('#dash-category-row .chip[onclick*="all"]').classList.add('active'); } 
    } 
    renderDash();
}
function renderLibrary() { filterRecipes(); }
function filterRecipes() { 
    const q = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : ''; const grid = document.getElementById('lib-recipes-grid');
    const sortType = document.getElementById('lib-sort-select') ? document.getElementById('lib-sort-select').value : 'default'; if(!grid) return; 
    let filtered = RECIPES.filter(r => r.status !== 'pending' && r.name.toLowerCase().includes(q));
    if(!activeCategories.includes('all')) filtered = filtered.filter(r => r.cat && r.cat.some(c => activeCategories.includes(c))); 
    if (sortType === 'cost-asc') filtered.sort((a,b) => getRecipePortionCost(a) - getRecipePortionCost(b));
    else if (sortType === 'cost-desc') filtered.sort((a,b) => getRecipePortionCost(b) - getRecipePortionCost(a)); else if (sortType === 'rating-desc') filtered.sort((a,b) => parseFloat(getAverageRating(b).avg) - parseFloat(getAverageRating(a).avg));
    else if (sortType === 'time-asc') filtered.sort((a,b) => parseInt(a.time) - parseInt(b.time));
    if(filtered.length === 0) grid.innerHTML = `<div class="empty-state">Aradığınız kriterlere uygun reçete bulunamadı.</div>`; else grid.innerHTML = filtered.map(r => makeRecipeCard(r)).join('');
}
function setLibFilter(element, cat) { 
    if (cat === 'all') { activeCategories = ['all']; document.querySelectorAll('#lib-category-row .chip').forEach(c => c.classList.remove('active')); element.classList.add('active'); } else { 
        if (activeCategories.includes('all')) { activeCategories = []; document.querySelector('#lib-category-row .chip[onclick*="all"]').classList.remove('active'); } 
        const index = activeCategories.indexOf(cat); if (index > -1) { activeCategories.splice(index, 1); element.classList.remove('active'); } else { activeCategories.push(cat); element.classList.add('active'); } 
        if (activeCategories.length === 0) { activeCategories = ['all']; document.querySelector('#lib-category-row .chip[onclick*="all"]').classList.add('active'); } 
    } 
    filterRecipes(); 
}
function openMobileCategoryModal() { document.getElementById('mobile-category-modal').style.display = 'block'; }
function closeMobileCategoryModal() { document.getElementById('mobile-category-modal').style.display = 'none'; }
function applyMobileCategories() { const checkedBoxes = document.querySelectorAll('#mobile-cat-checkboxes input:checked'); activeCategories = Array.from(checkedBoxes).map(cb => cb.value); if(activeCategories.length === 0) activeCategories = ['all']; renderDash(); filterRecipes(); closeMobileCategoryModal(); showToast("Seçimler uygulandı.", "info"); }

// ==========================================
// 🔍 ÖN İZLEME (PREVIEW) MODALI
// ==========================================
function openPreviewModal(type, id) {
    let data = null; let authorName = "Bilinmiyor"; let alertBox = document.getElementById('preview-type-alert'); let legendBox = document.getElementById('preview-diff-legend'); let orig = null;
    if (type === 'recipe') {
        const r = RECIPES.find(x => x.id === id);
        if(r) { data = r; authorName = r.macros?.author_name || 'Bilinmiyor'; alertBox.style.display = 'block'; alertBox.style.background = '#eff6ff'; alertBox.style.color = '#1e40af'; alertBox.style.border = '1px solid #bfdbfe'; alertBox.innerHTML = '✨ <b>TAMAMEN YENİ TARİF:</b> Bu tarif kütüphaneye ilk kez eklenecektir.'; legendBox.style.display = 'none'; }
    } else if (type === 'edit') {
        const e = PENDING_EDITS.find(x => x.editId === id);
        if(e) { data = e.draft; orig = RECIPES.find(r => r.id === e.originalRecipeId); authorName = e.suggestedBy || 'Bilinmiyor'; alertBox.style.display = 'block'; alertBox.style.background = '#fff7ed'; alertBox.style.color = '#9a3412'; alertBox.style.border = '1px solid #fed7aa'; alertBox.innerHTML = '🔄 <b>REVİZYON (DÜZENLEME):</b> Bu tarif var olan bir tarifin değiştirilmiş halidir.'; legendBox.style.display = 'block'; }
    }
    if (!data) return;

    document.getElementById('preview-recipe-name').textContent = data.name; document.getElementById('preview-img').src = data.img || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&q=80';
    document.getElementById('preview-img-diff').innerHTML = orig && orig.img !== data.img ? `<span style="background:var(--primary); color:white; padding:4px 8px; border-radius:6px; font-size:12px; font-weight:bold;"> Görüntü Değişti</span>` : '';
    document.getElementById('preview-author').textContent = authorName;

    let badgesHtml = `<span class="tag-diff">${data.diff}</span><span class="tag-time">${data.time}</span>`;
    if (data.allergens && data.allergens.length > 0) { data.allergens.forEach(alg => badgesHtml += `<span class="tag-allergen-badge">⚠️ ${alg}</span>`); } else { badgesHtml += `<span class="tag-diff" style="background:#dcfce7; color:#15803d;">✅ Alerjen Yok</span>`; }
    if(data.isVegan) badgesHtml += `<span class="tag-diff" style="background:#f0fdf4; color:#166534;">🌱 Vegan</span>`; if(data.isVejetaryen) badgesHtml += `<span class="tag-diff" style="background:#f0fdf4; color:#166534;">🥗 Vejetaryen</span>`;
    document.getElementById('preview-badges').innerHTML = badgesHtml;

    function renderMacro(val, origVal, unit) { if(!orig || val == origVal) return val + unit; return `<del style="color:#991b1b; font-size:13px;">${origVal}${unit}</del> <ins style="color:#1e3a8a; text-decoration:none; font-size:18px; background:#eff6ff; padding: 2px 6px; border-radius: 6px;">${val}${unit}</ins>`; }
    document.getElementById('preview-extra-info').innerHTML = `<strong>Varsayılan Porsiyon:</strong> ${renderMacro(data.basePortion, orig?.basePortion, ' Kişilik')} <br><strong>Hazırlık Süresi:</strong> ${renderMacro(data.time, orig?.time, '')} <br><strong>Zorluk Derecesi:</strong> ${renderMacro(data.diff, orig?.diff, '')} <br><strong>Kategoriler:</strong> ${data.cat && data.cat.length > 0 ? data.cat.join(', ') : 'Belirtilmemiş'}`;
    document.getElementById('prev-cal').innerHTML = renderMacro(data.macros?.cal||0, orig?.macros?.cal||0, ''); document.getElementById('prev-pro').innerHTML = renderMacro(data.macros?.pro||0, orig?.macros?.pro||0, 'g'); document.getElementById('prev-fat').innerHTML = renderMacro(data.macros?.fat||0, orig?.macros?.fat||0, 'g'); document.getElementById('prev-carbs').innerHTML = renderMacro(data.macros?.carbs||0, orig?.macros?.carbs||0, 'g');

    if (data.contentImgs && data.contentImgs.length > 0) { document.getElementById('preview-content-imgs-container').innerHTML = data.contentImgs.map(url => `<img src="${url}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0;">`).join(''); } else { document.getElementById('preview-content-imgs-container').innerHTML = ''; }

    let ingHtml = '';
    const origIngsStr = orig && orig.ingredients ? orig.ingredients.map(i => `${i.name.toLowerCase()}|${i.amt}|${i.unitCost}`) : []; const draftIngsStr = data.ingredients ? data.ingredients.map(i => `${i.name.toLowerCase()}|${i.amt}|${i.unitCost}`) : [];
    if(data.ingredients) { data.ingredients.forEach(i => { let s = `${i.name.toLowerCase()}|${i.amt}|${i.unitCost}`; if(!orig || origIngsStr.includes(s)) { ingHtml += `<li><b>${i.name}</b>: ${i.amt} <span style="color:var(--text-muted); font-size:12px;">(₺${i.unitCost})</span></li>`; } else { ingHtml += `<li style="background:#eff6ff; color:#1e3a8a; padding:4px 8px; border-radius:6px; margin-bottom:4px; border: 1px solid #bfdbfe;"><b>+ ${i.name}</b>: ${i.amt} (₺${i.unitCost})</li>`; } }); }
    if(orig && orig.ingredients) { orig.ingredients.forEach(i => { let s = `${i.name.toLowerCase()}|${i.amt}|${i.unitCost}`; if(!draftIngsStr.includes(s)) { ingHtml += `<li style="background:#fee2e2; color:#991b1b; text-decoration:line-through; padding:4px 8px; border-radius:6px; margin-bottom:4px; border: 1px solid #fecaca;"><b>- ${i.name}</b>: ${i.amt} (₺${i.unitCost})</li>`; } }); }
    document.getElementById('preview-ingredients').innerHTML = ingHtml || '<li style="color:#94a3b8; list-style:none;">Malzeme yok.</li>';

    let stepHtml = '';
    const origStepsStr = orig && orig.steps ? orig.steps.map(s => s.text.toLowerCase()) : []; const draftStepsStr = data.steps ? data.steps.map(s => s.text.toLowerCase()) : [];
    if(data.steps) { data.steps.forEach(s => { let txt = s.text; if(!orig || origStepsStr.includes(txt.toLowerCase())) { stepHtml += `<li style="margin-bottom:8px; color:var(--text-main);">${txt}</li>`; } else { stepHtml += `<li style="background:#eff6ff; color:#1e3a8a; padding:6px; border-radius:6px; margin-bottom:8px; border: 1px solid #bfdbfe;">+ ${txt}</li>`; } }); }
    if(orig && orig.steps) { orig.steps.forEach(s => { let txt = s.text; if(!draftStepsStr.includes(txt.toLowerCase())) { stepHtml += `<li style="background:#fee2e2; color:#991b1b; text-decoration:line-through; padding:6px; border-radius:6px; margin-bottom:8px; border: 1px solid #fecaca;">- ${txt}</li>`; } }); }
    document.getElementById('preview-steps').innerHTML = stepHtml || '<li style="color:#94a3b8; list-style:none;">Adım yok.</li>';

    let mepHtml = '';
    const origMepStr = orig && orig.mep ? orig.mep.map(m => m.toLowerCase()) : []; const draftMepStr = data.mep ? data.mep.map(m => m.toLowerCase()) : [];
    if(data.mep) { data.mep.forEach(m => { if(!orig || origMepStr.includes(m.toLowerCase())) { mepHtml += `<li style="margin-bottom:8px; color:var(--text-main);">${m}</li>`; } else { mepHtml += `<li style="background:#eff6ff; color:#1e3a8a; padding:6px; border-radius:6px; margin-bottom:8px; border: 1px solid #bfdbfe;">+ ${m}</li>`; } }); }
    if(orig && orig.mep) { orig.mep.forEach(m => { if(!draftMepStr.includes(m.toLowerCase())) { mepHtml += `<li style="background:#fee2e2; color:#991b1b; text-decoration:line-through; padding:6px; border-radius:6px; margin-bottom:8px; border: 1px solid #fecaca;">- ${m}</li>`; } }); }
    document.getElementById('preview-mep').innerHTML = mepHtml || '<li style="color:#94a3b8; list-style:none;">Ön hazırlık girilmemiş.</li>';

    document.getElementById('preview-modal').style.display = 'block';
}
function closePreviewModal() { document.getElementById('preview-modal').style.display = 'none'; }

// ==========================================
// 📖 DETAY EKRANI, SİHİRBAZ VE YENİ TARİF
// ==========================================
function openRecipe(id) {
    const r = RECIPES.find(x => x.id === id);
    if(!r) return;
    currentRecipe = r; portion = r.basePortion; isWizardUnlocked = false; tempEditDraft = null;
    const wizardSidebar = document.getElementById('detail-wizard-sidebar');
    if (currentUser && currentUser.role === 'guest') { if(wizardSidebar) wizardSidebar.style.display = 'none'; } else { if(wizardSidebar) wizardSidebar.style.display = 'flex'; document.getElementById('wizard-lock-overlay').style.display = 'flex'; document.getElementById('wizard-content-wrapper').style.display = 'none'; }
    goPage('recipe-detail', null); renderRecipeDetailHTML();
}

function renderRecipeDetailHTML() {
    const r = currentRecipe; document.getElementById('detail-name').textContent = r.name; document.getElementById('detail-img').src = r.img;
    if(currentUser && currentUser.role === 'admin') { const secBox = document.getElementById('detail-security-box'); if(secBox) { secBox.style.display = 'block'; document.getElementById('detail-author-name').textContent = r.macros?.author_name || 'Sistem / Anonim'; document.getElementById('detail-author-email').textContent = r.macros?.author_email || 'Kayıt Yok'; } }
    
    const badgeContainer = document.getElementById('detail-badges-container');
    badgeContainer.innerHTML = `<span id="detail-badge-diff" class="tag-diff">${r.diff}</span><span id="detail-badge-time" class="tag-time">${r.time}</span>`;
    if (r.allergens && r.allergens.length > 0) { r.allergens.forEach(alg => { badgeContainer.innerHTML += `<span class="tag-allergen-badge">⚠️ ${alg}</span>`; }); } else { badgeContainer.innerHTML += `<span class="tag-diff" style="background:#dcfce7; color:#15803d;">✅ Alerjen Yok</span>`; }
    
    const contentSec = document.getElementById('detail-content-imgs-section'); const contentGrid = document.getElementById('detail-content-imgs-grid');
    if (r.contentImgs && r.contentImgs.length > 0) { contentSec.style.display = 'block'; contentGrid.innerHTML = r.contentImgs.map(url => `<img src="${url}" class="content-img-item" onclick="window.open('${url}', '_blank')">`).join(''); } else { contentSec.style.display = 'none'; }
    document.getElementById('detail-diet-container').innerHTML = `<span>🌱 Vegan: ${r.isVegan ? '✅' : '❌'}</span> <span style="color:#cbd5e1;">|</span> <span>🥗 Vejetaryen: ${r.isVejetaryen ? '✅' : '❌'}</span>`;
    
    document.getElementById('detail-portion-input').value = portion;
    const factor = portion / r.basePortion;
    document.getElementById('macro-cal').textContent = Math.round((r.macros?.cal || 0) * factor);
    document.getElementById('macro-pro').textContent = Math.round((r.macros?.pro || 0) * factor) + "g"; document.getElementById('macro-fat').textContent = Math.round((r.macros?.fat || 0) * factor) + "g";
    document.getElementById('macro-carbs').textContent = Math.round((r.macros?.carbs || 0) * factor) + "g";

    const isLocked = !isWizardUnlocked; const lockAttr = isLocked ? 'readonly' : ''; let ingHtml = '';
    if(r.ingredients && r.ingredients.length > 0) {
      ingHtml = r.ingredients.map((i, idx) => {
          const computedCost = (i.unitCost * factor); const displayAmt = isLocked ? scaleAmount(i.amt, factor) : i.amt; const deleteBtn = (!isLocked && currentUser.role === 'admin') ? `<button type="button" class="btn-ing-delete" onclick="deleteIngInline(${idx})">🗑️</button>` : '';
          return `<div class="ing-edit-row"><input type="text" class="ing-edit-input ing-input-name" value="${i.name}" onchange="updateIngInline(${idx}, 'name', this.value)" ${lockAttr}><input type="text" class="ing-edit-input ing-input-amt" value="${displayAmt}" onchange="updateIngInline(${idx}, 'amt', this.value)" ${lockAttr}><input type="number" class="ing-edit-input ing-input-cost" value="${i.unitCost}" min="0" onchange="updateIngInline(${idx}, 'unitCost', this.value)" ${lockAttr}><span style="font-weight:700; color:var(--bg-dark); width: 70px; text-align:right; font-size:15px;">₺${computedCost.toFixed(2)}</span>${deleteBtn}</div>`;
      }).join('');
    } else { ingHtml = `<p style="color:#94a3b8;">Malzeme listesi boş.</p>`; }
    if(!isLocked && currentUser.role === 'admin') ingHtml += `<button type="button" class="btn-ing-add" onclick="addIngInline()">➕ Yeni Malzeme Satırı Ekle</button>`;
    document.getElementById('ingredients-list').innerHTML = ingHtml;
    document.getElementById('detail-mep-list').innerHTML = r.mep && r.mep.length > 0 ? r.mep.map(m => `<label class="mep-item"><input type="checkbox"> <span>${m}</span></label>`).join('') : `<p style="color:#94a3b8;">Ön hazırlık maddesi girilmemiş.</p>`;
    document.getElementById('steps-list').innerHTML = r.steps && r.steps.length > 0 ? r.steps.map((s, idx) => `<div class="step-item"><strong>Adım ${idx+1}:</strong> ${s.text}</div>`).join('') : `<p style="color:#94a3b8;">Hazırlanış adımı girilmemiş.</p>`;
    
    const ratingData = getAverageRating(r);
    let reviewsHtml = `<p style="font-weight:800; color:var(--bg-dark); font-size:16px; margin-bottom:15px;">Genel Skor: ⭐ ${ratingData.avg} (${ratingData.count} Yorum)</p>`;
    if(r.reviews && r.reviews.length > 0) { reviewsHtml += r.reviews.map((rev, index) => { const deleteReviewBtn = currentUser.role === 'admin' ? `<button type="button" onclick="deleteReview(${index}, event)" style="background: none; border: none; color: var(--red); cursor: pointer; font-size: 13px; font-weight:bold;">🗑️ Sil</button>` : ''; return `<div class="review-item"><div class="review-top"><span class="review-author">👤 ${rev.author}</span><div style="display: flex; align-items: center; gap: 8px;"><span style="font-size:12px;">${"⭐".repeat(parseInt(rev.rating))}</span>${deleteReviewBtn}</div></div><div class="review-body">${rev.text}</div></div>`; }).join('');
    } else { reviewsHtml += `<p style="color:#94a3b8; font-style:italic;" id="no-review-msg">Henüz değerlendirme yapılmamış.</p>`; }
    document.getElementById('reviews-list-box').innerHTML = reviewsHtml;
    
    const reviewFormBox = document.getElementById('reviewForm');
    if (reviewFormBox) { if (currentUser && currentUser.role === 'guest') { reviewFormBox.style.display = 'none'; } else { reviewFormBox.style.display = 'block'; } }
}

function handlePortionInput(change) { let newPortion = portion + change; if(newPortion < 1) newPortion = 1; portion = newPortion; renderRecipeDetailHTML(); }

function submitReview(e) { 
    e.preventDefault(); if (currentUser && currentUser.role === 'guest') { showToast("Misafir hesaplar değerlendirme yapamaz! Lütfen kalıcı üyeliğe geçiş yapın.", "error"); return; }
    if(!checkSpamProtection('send_review')) return;
    const author = document.getElementById('rev-author').value; const rating = parseInt(document.getElementById('rev-rating').value); const text = document.getElementById('rev-text').value;
    if(BAD_WORDS.some(word => text.toLowerCase().includes(word))) { showToast("Yorumunuz engellendi!", "error"); return; } 
    if(!currentRecipe.reviews) currentRecipe.reviews = [];
    currentRecipe.reviews.push({ author, rating, text }); saveRecipeToCloud(currentRecipe); 
    document.getElementById('reviewForm').reset(); renderRecipeDetailHTML(); renderDash(); filterRecipes(); showToast("Yorum eklendi!", "success"); 
}

function deleteReview(index, event) { if(event) event.stopPropagation(); if(currentUser.role !== 'admin') return; if(currentRecipe && currentRecipe.reviews) { currentRecipe.reviews.splice(index, 1); saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); renderDash(); filterRecipes(); showToast("Değerlendirme silindi.", "success"); } }

function unlockWizard() {
    isWizardUnlocked = true; document.getElementById('wizard-lock-overlay').style.display = 'none'; document.getElementById('wizard-content-wrapper').style.display = 'flex';
    if (currentUser.role === 'user') { tempEditDraft = JSON.parse(JSON.stringify(currentRecipe)); document.getElementById('wizard-main-title').textContent = "🛠️ Revizyon Taslağı"; document.getElementById('wizard-main-desc').textContent = "Değişiklikleriniz Baş Şef onayından sonra ana tarife yansır."; document.getElementById('btn-save-wizard').textContent = "📨 Onaya Gönder";
    } else { document.getElementById('wizard-main-title').textContent = "🛠️ Hızlı Düzenleme Sihirbazı"; document.getElementById('wizard-main-desc').textContent = "Reçete mühendisliği güncellemeleri."; document.getElementById('btn-save-wizard').textContent = "💾 Değişiklikleri Kaydet"; }
    setupWizardInputs(); renderRecipeDetailHTML(); showToast(currentUser.role === 'admin' ? "Sihirbaz kilidi açıldı." : "Revizyon taslağı açıldı.", "success");
}

function setupWizardInputs() {
    const r = currentRecipe; document.getElementById('wizard-name').value = r.name; document.getElementById('wizard-img').value = r.img || '';
    document.getElementById('wizard-content-imgs').value = r.contentImgs ? r.contentImgs.join('\n') : ''; document.getElementById('wizard-time').value = r.time; document.getElementById('wizard-diff').value = r.diff; document.getElementById('wizard-basePortion').value = r.basePortion; document.getElementById('wizard-tick-select').value = r.tick || "grey"; document.getElementById('wizard-tick-display').innerHTML = getTickIcon(r.tick);
    document.getElementById('wizard-cal').value = r.macros?.cal || 0; document.getElementById('wizard-pro').value = r.macros?.pro || 0; document.getElementById('wizard-fat').value = r.macros?.fat || 0; document.getElementById('wizard-carbs').value = r.macros?.carbs || 0;
    document.querySelectorAll('.wizard-allergen').forEach(cb => { cb.checked = r.allergens && r.allergens.includes(cb.value); }); document.getElementById('wizard-is-vegan').checked = r.isVegan || false; document.getElementById('wizard-is-vejetaryen').checked = r.isVejetaryen || false;
    document.querySelectorAll('#wizard-cat-group input[type="checkbox"]').forEach(cb => { cb.checked = r.cat && r.cat.includes(cb.value); }); const saleInp = document.getElementById('wizard-sale-price'); if(saleInp) saleInp.value = r.salePrice || '';
    document.getElementById('wizard-ingredients').value = r.ingredients ? r.ingredients.map(i => `${i.name},${i.amt},${i.unitCost}`).join('\n') : ''; document.getElementById('wizard-steps').value = r.steps ? r.steps.map(s => s.text).join('\n') : ''; document.getElementById('wizard-mep').value = r.mep ? r.mep.join('\n') : '';
}

function updateWizardCategories() { if(!isWizardUnlocked) return; const arr = Array.from(document.querySelectorAll('#wizard-cat-group input[type="checkbox"]:checked')).map(cb => cb.value); if(currentUser.role === 'admin') { currentRecipe.cat = arr.length > 0 ? arr : ["ana"]; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); renderDash(); filterRecipes(); } else { tempEditDraft.cat = arr.length > 0 ? arr : ["ana"]; } }
function updateWizardField(field, value) { if(!isWizardUnlocked) return; if(currentUser.role === 'admin') { currentRecipe[field] = value; if(field === 'tick') document.getElementById('wizard-tick-display').innerHTML = getTickIcon(value); if(field === 'basePortion') portion = currentRecipe.basePortion; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); renderDash(); filterRecipes(); } else { tempEditDraft[field] = value; } }
function updateWizardContentImgs(textValue) { if(!isWizardUnlocked) return; const arr = textValue.split('\n').map(l => l.trim()).filter(line => line !== ''); if(currentUser.role === 'admin') { currentRecipe.contentImgs = arr; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); } else { tempEditDraft.contentImgs = arr; } }
function parseIngredientLine(line) {
    if(!line.trim()) return null;
    if(line.includes(',')) { let parts = line.split(',').map(p => p.trim()); return { name: parts[0], amt: parts[1] || '1 Adet', unitCost: parseFloat(parts[2]) || 0 }; }
    let parts = line.trim().split(/\s+/);
    if(parts.length > 1) { let cost = parseFloat(parts[parts.length - 1]); if(!isNaN(cost)) { parts.pop(); let qty = parts.pop(); let name = parts.join(" "); return { name, amt: qty, unitCost: cost }; } else { let qty = parts.pop(); let name = parts.join(" "); return { name, amt: qty, unitCost: 0 }; } }
    return { name: line.trim(), amt: '1 birim', unitCost: 0 };
}
function updateWizardIngredients(textValue) { if(!isWizardUnlocked) return; const arr = textValue.split('\n').filter(line => line.trim() !== '').map(line => parseIngredientLine(line)); if(currentUser.role === 'admin') { currentRecipe.ingredients = arr; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); renderDash(); } else { tempEditDraft.ingredients = arr; } }
function updateWizardSteps(textValue) { if(!isWizardUnlocked) return; const arr = textValue.split('\n').filter(line => line.trim() !== '').map(l => ({ text: l })); if(currentUser.role === 'admin') { currentRecipe.steps = arr; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); } else { tempEditDraft.steps = arr; } }
function updateWizardMep(textValue) { if(!isWizardUnlocked) return; const arr = textValue.split('\n').filter(line => line.trim() !== ''); if(currentUser.role === 'admin') { currentRecipe.mep = arr; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); } else { tempEditDraft.mep = arr; } }
function updateWizardMacros() { if(!isWizardUnlocked) return; const arr = { cal: parseInt(document.getElementById('wizard-cal').value)||0, pro: parseInt(document.getElementById('wizard-pro').value)||0, fat: parseInt(document.getElementById('wizard-fat').value)||0, carbs: parseInt(document.getElementById('wizard-carbs').value)||0, author_name: currentRecipe.macros?.author_name || currentUser.name, author_email: currentRecipe.macros?.author_email || currentUser.email }; if(currentUser.role === 'admin') { currentRecipe.macros = arr; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); } else { tempEditDraft.macros = arr; } }
function updateWizardAllergens() { if(!isWizardUnlocked) return; const arr = Array.from(document.querySelectorAll('.wizard-allergen:checked')).map(cb => cb.value); if(currentUser.role === 'admin') { currentRecipe.allergens = arr; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); } else { tempEditDraft.allergens = arr; } }
function updateWizardDiet() { if(!isWizardUnlocked) return; if(currentUser.role === 'admin') { currentRecipe.isVegan = document.getElementById('wizard-is-vegan').checked; currentRecipe.isVejetaryen = document.getElementById('wizard-is-vejetaryen').checked; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); } else { tempEditDraft.isVegan = document.getElementById('wizard-is-vegan').checked; tempEditDraft.isVejetaryen = document.getElementById('wizard-is-vejetaryen').checked; } }

function updateIngInline(idx, field, value) { if(!isWizardUnlocked || currentUser.role !== 'admin') return; if(field === 'unitCost') value = parseFloat(value) || 0; currentRecipe.ingredients[idx][field] = value; saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); renderDash(); filterRecipes(); }
function addIngInline() { if(!isWizardUnlocked || currentUser.role !== 'admin') return; if(!currentRecipe.ingredients) currentRecipe.ingredients = []; currentRecipe.ingredients.push({name: "Yeni Malzeme", amt: "1 Adet", unitCost: 0}); saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); }
function deleteIngInline(idx) { if(!isWizardUnlocked || currentUser.role !== 'admin') return; currentRecipe.ingredients.splice(idx, 1); saveRecipeToCloud(currentRecipe); renderRecipeDetailHTML(); renderDash(); filterRecipes(); }

async function deleteCurrentRecipe() {
    if(!currentRecipe || currentUser.role !== 'admin') return;
    if(confirm(`"${currentRecipe.name}" tarifini tamamen silmek istediğinize emin misiniz?`)) { 
        RECIPES = RECIPES.filter(r => r.id !== currentRecipe.id);
        const favIdx = NOTEBOOK_IDS.indexOf(currentRecipe.id); if(favIdx > -1) { NOTEBOOK_IDS.splice(favIdx, 1); removeNotebookFromCloud(currentUser.email, currentRecipe.id); }
        await deleteRecipeFromCloud(currentRecipe.id); logAdminAction(`"${currentRecipe.name}" adlı reçeteyi sistemden tamamen sildi.`); showToast("Reçete silindi.", "success");
        goPage('recipes', null); renderDash(); filterRecipes();
    }
}

function submitWizardChanges() {
    if(currentUser.role === 'admin') { logAdminAction(`"${currentRecipe.name}" adlı reçeteyi düzenledi.`); showToast("Değişiklikler anlık olarak buluta kaydedildi.", "success"); } else {
        if(!checkSpamProtection('suggest_edit')) return; 
        if(!tempEditDraft) return;
        tempEditDraft.macros.author_name = currentUser.name; tempEditDraft.macros.author_email = currentUser.email;
        const newEdit = { editId: Date.now(), originalRecipeId: currentRecipe.id, recipeName: currentRecipe.name, suggestedBy: currentUser.name, draft: tempEditDraft };
        PENDING_EDITS.push(newEdit); saveEditToCloud(newEdit); showToast("Öneriniz onaya sunuldu!", "success"); renderMyRequests();
    }
    isWizardUnlocked = false; tempEditDraft = null; document.getElementById('wizard-lock-overlay').style.display = 'flex';
    document.getElementById('wizard-content-wrapper').style.display = 'none'; updateBadges();
}

function openAddRecipeModal() { if(currentUser.role === 'guest') { showToast("Misafirler reçete ekleyemez.", "error"); return; } document.getElementById('add-recipe-modal').style.display = 'block'; }
function closeAddRecipeModal() { document.getElementById('add-recipe-modal').style.display = 'none'; }

function submitNewRecipe(e) {
    e.preventDefault();
    if(currentUser.role === 'guest') { showToast("Misafirler reçete ekleyemez.", "error"); return; }
    if(!checkSpamProtection('add_recipe')) return; 

    const name = document.getElementById('add-name').value; const selectedCats = Array.from(document.querySelectorAll('#add-cat-group input[type="checkbox"]:checked')).map(cb => cb.value); if(selectedCats.length === 0) selectedCats.push("ana");
    const diff = document.getElementById('add-diff').value; const time = document.getElementById('add-time').value + " dk"; const basePortion = parseInt(document.getElementById('add-portion').value) || 4;
    const salePriceVal = parseFloat(document.getElementById('add-sale-price').value);
    let img = document.getElementById('add-img').value || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&q=80"; const contentImgs = document.getElementById('add-content-imgs').value.split('\n').map(line => line.trim()).filter(line => line !== '');
    const selectedAllergens = Array.from(document.querySelectorAll('input[name="add-allergens"]:checked')).map(cb => cb.value); const isVegan = document.getElementById('add-is-vegan').checked; const isVejetaryen = document.getElementById('add-is-vejetaryen').checked;
    const parsedIngredients = document.getElementById('add-ingredients').value.split('\n').filter(l => l.trim() !== '').map(line => parseIngredientLine(line)); const parsedMep = document.getElementById('add-mep').value.split('\n').filter(l => l.trim() !== '');
    const parsedSteps = document.getElementById('add-steps').value.split('\n').filter(l => l.trim() !== '').map(l => ({ text: l }));
    const newR = { id: Date.now(), name, img, contentImgs, cat: selectedCats, diff, time, basePortion, tick: "grey", status: currentUser.role === 'admin' ? "active" : "pending", allergens: selectedAllergens, isVegan: isVegan, isVejetaryen: isVejetaryen, salePrice: isNaN(salePriceVal) ? null : salePriceVal, macros: { cal: parseInt(document.getElementById('add-cal').value)||300, pro: parseInt(document.getElementById('add-pro').value)||15, fat: parseInt(document.getElementById('add-fat').value)||10, carbs: parseInt(document.getElementById('add-carbs').value)||20, author_name: currentUser.name, author_email: currentUser.email }, ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{name:"Harç", amt:"1 Adet", unitCost:100}], mep: parsedMep.length > 0 ? parsedMep : ["Malzemeleri tartın."], steps: parsedSteps.length > 0 ? parsedSteps : [{text: "Pişirip servis edin."}], reviews: [] };
    
    RECIPES.push(newR); saveRecipeToCloud(newR); closeAddRecipeModal(); document.getElementById('addRecipeForm').reset();
    if (currentUser.role === 'admin') { logAdminAction(`"${name}" adlı yepyeni bir reçeteyi kütüphaneye ekledi.`); showToast("Reçete buluta eklendi!", "success"); renderDash(); filterRecipes();
    } else { showToast("Reçete onaya gönderildi!", "success"); renderMyRequests(); updateBadges(); }
}

// ==========================================
// ⏳ ONAY VE REDDETME SİSTEMİ
// ==========================================
function renderPendingRecipes() {
    const box = document.getElementById('pending-recipes-list'); if(!box || currentUser.role !== 'admin') return;
    const pending = RECIPES.filter(r => r.status === 'pending');
    if(pending.length === 0) { box.innerHTML = '<div class="empty-state">Onay bekleyen yeni tarif yok.</div>'; return; }
    box.innerHTML = pending.map(r => `
    <div class="pending-item" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:18px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:12px; border-left: 5px solid var(--primary);">
        <div class="pending-info" style="display:flex; flex-direction:column; gap:6px;">
            <span class="pending-title" style="font-weight:800; font-size:16px; color:#0f172a;">🍲 ${r.name}</span>
            <span class="pending-meta" style="font-size:13px; color:#64748b; font-weight:600;">Gönderen: ${r.macros?.author_name || 'Bilinmiyor'}</span>
        </div>
        <div class="pending-actions" style="display:flex; gap:10px;">
            <button type="button" onclick="openPreviewModal('recipe', ${r.id})" style="background:var(--primary); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">🔍 Ön İzleme</button>
            <button type="button" onclick="approveRecipe(${r.id})" style="background:var(--green); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">✅ Kabul Et</button>
            <button type="button" onclick="rejectRecipe(${r.id})" style="background:var(--red); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">❌ Reddet</button>
        </div>
    </div>`).join('');
}

function approveRecipe(id) { 
    if (currentUser.role !== 'admin') return; const r = RECIPES.find(x => x.id === id);
    if(r) { 
        r.status = 'active'; const authorEmail = r.macros?.author_email; const scoreData = getUserScore(authorEmail);
        if (r.tick !== 'blue') { if (scoreData.avg >= 4.0) r.tick = 'green'; else r.tick = 'grey'; }
        saveRecipeToCloud(r); renderPendingRecipes(); logAdminAction(`"${r.name}" adlı yeni tarif talebini ONAYLADI.`); showToast(`Kütüphaneye alındı! 🎉`, "success"); updateBadges(); closePreviewModal(); 
    } 
}

function renderPendingEdits() {
    const box = document.getElementById('pending-edits-list'); if(!box || currentUser.role !== 'admin') return;
    if(PENDING_EDITS.length === 0) { box.innerHTML = '<div class="empty-state">Onay bekleyen revizyon yok.</div>'; return; }
    box.innerHTML = PENDING_EDITS.map(edit => `
    <div class="pending-item" style="display:flex; justify-content:space-between; align-items:center; background:#fff7ed; padding:18px; border-radius:12px; border:1px solid #fed7aa; margin-bottom:12px; border-left: 5px solid var(--amber);">
        <div class="pending-info" style="display:flex; flex-direction:column; gap:6px;">
            <span class="pending-title" style="font-weight:800; font-size:16px; color:#9a3412;">🔄 ${edit.recipeName} (Revizyon)</span>
            <span class="pending-meta" style="font-size:13px; color:#c2410c; font-weight:600;">Öneren: ${edit.suggestedBy}</span>
        </div>
        <div class="pending-actions" style="display:flex; gap:10px;">
            <button type="button" onclick="openPreviewModal('edit', ${edit.editId})" style="background:var(--primary); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">🔍 Ön İzleme</button>
            <button type="button" onclick="approveEdit(${edit.editId})" style="background:var(--amber); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">✅ Kabul Et</button>
            <button type="button" onclick="rejectEdit(${edit.editId})" style="background:transparent; color:var(--red); border:1px solid var(--red); padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">❌ Reddet</button>
        </div>
    </div>`).join('');
}

async function approveEdit(editId) { 
    if (currentUser.role !== 'admin') return; const edit = PENDING_EDITS.find(e => e.editId === editId); 
    if(edit) { 
        const rIndex = RECIPES.findIndex(r => r.id === edit.originalRecipeId); 
        if(rIndex > -1) { 
            RECIPES[rIndex] = edit.draft; RECIPES[rIndex].status = 'active'; const authorEmail = edit.draft.macros?.author_email; const scoreData = getUserScore(authorEmail);
            if (RECIPES[rIndex].tick !== 'blue') { if (scoreData.avg >= 4.0) RECIPES[rIndex].tick = 'green'; else RECIPES[rIndex].tick = 'grey'; }
            saveRecipeToCloud(RECIPES[rIndex]); PENDING_EDITS = PENDING_EDITS.filter(e => e.editId !== editId); await deleteEditFromCloud(editId); renderPendingEdits(); logAdminAction(`"${edit.recipeName}" revizyonunu ONAYLADI.`); showToast("Revizyon onaylandı!", "success"); updateBadges(); closePreviewModal(); 
        } 
    } 
}

function rejectRecipe(id) { document.getElementById('reject-item-id').value = id; document.getElementById('reject-item-type').value = 'recipe'; document.getElementById('reject-reason-text').value = ''; document.getElementById('reject-reason-modal').style.display = 'block'; }
function rejectEdit(editId) { document.getElementById('reject-item-id').value = editId; document.getElementById('reject-item-type').value = 'edit'; document.getElementById('reject-reason-text').value = ''; document.getElementById('reject-reason-modal').style.display = 'block'; }
function closeRejectModal() { document.getElementById('reject-reason-modal').style.display = 'none'; }

async function submitRejectReason(e) {
    e.preventDefault(); const id = parseInt(document.getElementById('reject-item-id').value); const type = document.getElementById('reject-item-type').value; const reason = document.getElementById('reject-reason-text').value;
    if (type === 'recipe') {
        const r = RECIPES.find(x => x.id === id);
        if(r) { 
            const newRej = { id: Date.now(), userEmail: r.macros?.author_email, title: r.name, type: 'Tarif Ekleme Reddedildi', reason: reason, date: new Date().toLocaleString('tr-TR') };
            REJECTED_REQUESTS.push(newRej); saveRejectedToCloud(newRej); RECIPES = RECIPES.filter(x => x.id !== id); await deleteRecipeFromCloud(id); logAdminAction(`"${r.name}" tarif talebini reddetti.`); 
        }
    } else {
        const edit = PENDING_EDITS.find(x => x.editId === id);
        if(edit) { 
            const newRej = { id: Date.now(), userEmail: edit.draft?.macros?.author_email, title: edit.recipeName, type: 'Tarif Düzenleme Reddedildi', reason: reason, date: new Date().toLocaleString('tr-TR') };
            REJECTED_REQUESTS.push(newRej); saveRejectedToCloud(newRej); PENDING_EDITS = PENDING_EDITS.filter(x => x.editId !== id); await deleteEditFromCloud(id); logAdminAction(`"${edit.recipeName}" revizyonunu reddetti.`); 
        }
    }
    localStorage.setItem('mavitrif_rejected', JSON.stringify(REJECTED_REQUESTS)); closeRejectModal(); closePreviewModal(); renderPendingRecipes(); renderPendingEdits(); updateBadges(); showToast("Reddetme işlemi tamamlandı.", "success");
    if(document.getElementById('page-my-requests').classList.contains('active')) renderMyRequests();
}

function renderMyRequests() {
    const rB = document.getElementById('my-pending-recipes-list'); const eB = document.getElementById('my-pending-edits-list'); const rjB = document.getElementById('my-rejected-list');
    if(!rB || !eB || !rjB || !currentUser || currentUser.role !== 'user') return; const myEmail = currentUser.email.toLowerCase();
    
    const mr = RECIPES.filter(r => r.status === 'pending' && (r.macros?.author_email || "").toLowerCase() === myEmail); 
    rB.innerHTML = mr.length === 0 ? '<div class="empty-state">Yok.</div>' : mr.map(r => `<div class="pending-item" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:18px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:12px; border-left: 5px solid var(--primary);"><div class="pending-info" style="display:flex; flex-direction:column; gap:6px;"><span class="pending-title" style="font-weight:800; font-size:16px; color:#0f172a;">🍲 ${r.name}</span><span class="pending-meta" style="font-size:13px; color:#64748b; font-weight:600;">Durum: Onay Bekliyor</span></div><div class="pending-actions" style="display:flex; gap:10px;"><button type="button" onclick="openPreviewModal('recipe', ${r.id})" style="background:var(--primary); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">🔍 İncele</button><button type="button" onclick="withdrawMyRecipe(${r.id})" style="background:var(--red); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">❌ İptal</button></div></div>`).join('');
    
    const me = PENDING_EDITS.filter(e => (e.draft?.macros?.author_email || "").toLowerCase() === myEmail); 
    eB.innerHTML = me.length === 0 ? '<div class="empty-state">Yok.</div>' : me.map(e => `<div class="pending-item" style="display:flex; justify-content:space-between; align-items:center; background:#fff7ed; padding:18px; border-radius:12px; border:1px solid #fed7aa; margin-bottom:12px; border-left: 5px solid var(--amber);"><div class="pending-info" style="display:flex; flex-direction:column; gap:6px;"><span class="pending-title" style="font-weight:800; font-size:16px; color:#9a3412;">🔄 ${e.recipeName}</span><span class="pending-meta" style="font-size:13px; color:#c2410c; font-weight:600;">Durum: Onay Bekliyor</span></div><div class="pending-actions" style="display:flex; gap:10px;"><button type="button" onclick="openPreviewModal('edit', ${e.editId})" style="background:var(--primary); color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">🔍 İncele</button><button type="button" onclick="withdrawMyEdit(${e.editId})" style="background:transparent; color:var(--red); border:1px solid var(--red); padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">❌ İptal</button></div></div>`).join('');
    
    const rj = REJECTED_REQUESTS.filter(r => (r.userEmail || "").toLowerCase() === myEmail); 
    rjB.innerHTML = rj.length === 0 ? '<div class="empty-state">Yok.</div>' : [...rj].reverse().map(r => `<div style="background:#fef2f2;padding:15px;border-radius:10px;margin-bottom:10px;"><b>${r.title}</b><p style="font-size:13px;color:#7f1d1d;">Neden: ${r.reason}</p></div>`).join('');
}

async function withdrawMyRecipe(id) { if(confirm("İptal edilsin mi?")){ RECIPES = RECIPES.filter(x => x.id !== id); await deleteRecipeFromCloud(id); renderMyRequests(); updateBadges(); showToast("Talep geri çekildi.", "info"); } }
async function withdrawMyEdit(eId) { if(confirm("İptal edilsin mi?")){ PENDING_EDITS = PENDING_EDITS.filter(e => e.editId !== eId); await deleteEditFromCloud(eId); renderMyRequests(); updateBadges(); showToast("Düzenleme talebi geri çekildi.", "info"); } }
function renderMyRecipes() { const b = document.getElementById('my-recipes-list'); if(!b) return; const fr = RECIPES.filter(r => NOTEBOOK_IDS.includes(r.id)); b.innerHTML = fr.length === 0 ? '<div class="empty-state">Defteriniz boş.</div>' : fr.map(r => makeRecipeCard(r)).join(''); }

// ==========================================
// 👤 PROFİL, UI GEÇİŞLERİ VE ESPRİLİ AI
// ==========================================
function loadProfile() { 
    if(!currentUser || currentUser.role === 'guest') return;
    document.getElementById('input-name').value = currentUser.name || ''; document.getElementById('input-email').value = currentUser.email || ''; document.getElementById('input-bio').value = currentUser.bio || ''; 
    const revAuthor = document.getElementById('rev-author'); if(revAuthor) revAuthor.value = currentUser.name;
    if (currentUser.avatar) { document.getElementById('profile-current-avatar').src = currentUser.avatar; document.getElementById('sb-profile-img').src = currentUser.avatar; } 
}

function applyCustomAvatarFile() { 
    if(currentUser.role === 'guest') return; const fileInput = document.getElementById('custom-avatar-file');
    if (fileInput.files && fileInput.files[0]) { 
        const file = fileInput.files[0]; if (file.size > 2 * 1024 * 1024) { showToast("Maksimum 2MB olmalıdır.", "warning"); return; } 
        const reader = new FileReader();
        reader.onload = function(e) { const base64Img = e.target.result; currentUser.avatar = base64Img; document.getElementById('profile-current-avatar').src = base64Img; document.getElementById('sb-profile-img').src = base64Img; saveUserToCloud(currentUser); saveSessionLocally(); showToast("Profil resmi güncellendi!", "success"); }; 
        reader.readAsDataURL(file);
    } else showToast("Lütfen cihazınızdan bir görsel seçin.", "error");
}

function saveProfile(e) { e.preventDefault(); if(currentUser.role === 'guest') return; currentUser.name = document.getElementById('input-name').value.trim(); currentUser.bio = document.getElementById('input-bio').value.trim(); document.getElementById('sb-profile-name').textContent = currentUser.name; saveUserToCloud(currentUser); saveSessionLocally(); showToast("Kişisel bilgiler güncellendi.", "success"); }
function changePassword(e) { e.preventDefault(); if(currentUser.role === 'guest') return; const oldPass = document.getElementById('profile-old-pass').value; const newPass = document.getElementById('profile-new-pass').value; const newPass2 = document.getElementById('profile-new-pass2').value; if (oldPass !== currentUser.password) { showToast("Mevcut şifrenizi yanlış girdiniz!", "error"); return; } if (newPass !== newPass2) { showToast("Yeni şifre ve tekrarı eşleşmiyor!", "error"); return; } if (newPass.length < 6) { showToast("Yeni şifreniz en az 6 karakter olmalıdır.", "warning"); return; } currentUser.password = newPass; saveUserToCloud(currentUser); saveSessionLocally(); document.getElementById('passwordChangeForm').reset(); showToast("Güvenlik şifreniz başarıyla değiştirildi!", "success"); }
function toggleInputType(id, btn) { const inp = document.getElementById(id); if(inp.type === 'password') { inp.type = 'text'; btn.textContent = '🔒'; } else { inp.type = 'password'; btn.textContent = '👁'; } }
function toggleAccordion(contentId) { const content = document.getElementById(contentId); const icon = document.getElementById(contentId.replace('content', 'icon')); if (content.style.display === 'none' || content.style.display === '') { content.style.display = 'block'; if(icon) icon.textContent = '🔼'; } else { content.style.display = 'none'; if(icon) icon.textContent = '🔽'; } }
function toggleSidebar() { const sidebar = document.getElementById('main-sidebar'); const overlay = document.getElementById('mobile-overlay'); if (sidebar.classList.contains('open')) { sidebar.classList.remove('open'); overlay.style.display = 'none'; } else { sidebar.classList.add('open'); overlay.style.display = 'block'; } }

function goPage(pageId, element) { 
    if(pageId !== 'recipe-detail') previousPage = pageId;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById(`page-${pageId}`).classList.add('active');
    if(element) { document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active')); element.classList.add('active'); } 
    if(window.innerWidth <= 992) { const sidebar = document.getElementById('main-sidebar'); const overlay = document.getElementById('mobile-overlay'); if(sidebar && sidebar.classList.contains('open')) { sidebar.classList.remove('open'); overlay.style.display = 'none'; } }
    
    if(pageId === 'approvals' && currentUser && currentUser.role === 'admin') { const currentPendingTotal = RECIPES.filter(r => r.status === 'pending').length + PENDING_EDITS.length; localStorage.setItem(`viewedPending_${currentUser.email}`, currentPendingTotal); updateBadges(); }
    if(pageId === 'my-requests' && currentUser && currentUser.role === 'user') { const myRejCount = REJECTED_REQUESTS.filter(r => (r.userEmail || "").toLowerCase() === currentUser.email.toLowerCase()).length; localStorage.setItem(`viewedRej_${currentUser.email}`, myRejCount); updateBadges(); }
    if(pageId === 'dms') { updateBadges(); }
    if(pageId === 'dash') renderDash(); if(pageId === 'recipes') { renderLibrary(); filterRecipes(); } if(pageId === 'stock') renderStockTable(); if(pageId === 'users') renderUserManagement(); if(pageId === 'announcements') renderAdminAnnouncements(); if(pageId === 'my-requests') renderMyRequests(); if(pageId === 'dms') renderUserDMs(); if(pageId === 'audit') renderAuditLog(); if(pageId === 'approvals') { renderPendingRecipes(); renderPendingEdits(); }
}

function goBackToPrevious() { goPage(previousPage, null); }
function getRecipePortionCost(r) { if(!r || !r.ingredients || r.ingredients.length === 0) return 0; return r.ingredients.reduce((sum, i) => sum + i.unitCost, 0) / r.basePortion; }
function getSuggestedSalePrice(r) { if(r.salePrice) return parseFloat(r.salePrice); return getRecipePortionCost(r) * 4; }
function getAverageRating(r) { if(!r.reviews || r.reviews.length === 0) return { avg: "0.0", count: 0 }; let total = r.reviews.reduce((sum, rev) => sum + parseFloat(rev.rating), 0); return { avg: (total / r.reviews.length).toFixed(1), count: r.reviews.length }; }
function getTickIcon(tickStatus) { if (tickStatus === 'blue') return '💙'; if (tickStatus === 'green') return '💚'; return '🤍'; }

function toggleNotebook(id, event) { 
    if(event) event.stopPropagation(); if(currentUser.role === 'guest') { showToast("Sadece kayıtlı personeller defter tutabilir.", "warning"); return; }
    const idx = NOTEBOOK_IDS.indexOf(id);
    if(idx > -1) { NOTEBOOK_IDS.splice(idx, 1); removeNotebookFromCloud(currentUser.email, id); showToast("Reçete defterden çıkarıldı.", "warning"); } 
    else { NOTEBOOK_IDS.push(id); addNotebookToCloud(currentUser.email, id); showToast("Reçete özel deftere eklendi!", "success"); } 
    renderDash(); filterRecipes(); renderMyRecipes();
}

function makeRecipeCard(r) { 
    const cost = getRecipePortionCost(r); const sale = getSuggestedSalePrice(r); const isFav = NOTEBOOK_IDS.includes(r.id); const ratingData = getAverageRating(r);
    let notebookBtnClass = isFav ? 'rc-btn favorited' : 'rc-btn'; const authorName = r.macros?.author_name || 'Sistem / Anonim';
    return `<div class="recipe-card" onclick="openRecipe(${r.id})"><div class="rc-actions"><button type="button" class="${notebookBtnClass}" onclick="toggleNotebook(${r.id}, event)">📔</button><div class="rc-btn">${getTickIcon(r.tick)}</div></div><div class="rc-thumb"><img src="${r.img}" alt="${r.name}"><div class="rc-badge">${r.diff}</div><div class="rc-stars">⭐ ${ratingData.avg} (${ratingData.count})</div></div><div class="rc-body"><div class="rc-name">${r.name}</div><div style="font-size:12px; color:var(--primary); font-weight:800; margin-bottom:8px;">👨‍🍳 Üretici Şef: ${authorName}</div><div class="rc-meta"><span>⏱ ${r.time}</span><span>👤 ${r.basePortion} Pors.</span></div><div class="rc-prices"><span class="rc-cost">Ort. Maliyet: ₺${cost.toFixed(2)}</span><span class="rc-sale">🏷 Ort. Satış: ₺${sale.toFixed(2)}</span></div></div></div>`;
}

function scaleAmount(amountStr, factor) { 
    if (!amountStr) return ""; if (factor === 1) return amountStr;
    return amountStr.replace(/(\d+([\.,]\d+)?)/g, (match) => { let val = parseFloat(match.replace(',', '.')); if (isNaN(val)) return match; let newVal = val * factor; return Number.isInteger(newVal) ? newVal.toString() : parseFloat(newVal.toFixed(2)).toString().replace('.', ','); });
}

function publishAnnouncement(e) {
    e.preventDefault(); const title = document.getElementById('ann-title').value.trim(); const text = document.getElementById('ann-text').value.trim(); if(!text || !title) return;
    const newAnn = { id: "ANN_" + Date.now(), title: title, text: text, date: new Date().toLocaleString('tr-TR'), author: currentUser.name };
    ANNOUNCEMENTS.push(newAnn); localStorage.setItem('mavitrif_ann', JSON.stringify(ANNOUNCEMENTS));
    if(window.supabaseClient) supabaseClient.from('announcements').insert([newAnn]).then();
    logAdminAction(`"${title}" başlıklı duyuruyu yayınladı.`); showToast("Duyuru tüm personele iletildi!", "success"); e.target.reset(); renderAdminAnnouncements(); updateInboxBadge();
}

window.deleteAnnouncement = async function(id) { if(confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) { ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== id); localStorage.setItem('mavitrif_ann', JSON.stringify(ANNOUNCEMENTS)); if(window.supabaseClient) await deleteAnnouncementFromCloud(id); showToast("Duyuru sistemden silindi.", "success"); renderAdminAnnouncements(); } }
function renderAdminAnnouncements() { const box = document.getElementById('admin-announcement-list'); if(!box || currentUser.role !== 'admin') return; if(ANNOUNCEMENTS.length === 0) { box.innerHTML = '<div class="empty-state">Yayınlanmış duyuru yok.</div>'; return; } box.innerHTML = [...ANNOUNCEMENTS].reverse().map(a => `<div style="background:white; padding:15px; border-radius:12px; border:1px solid var(--border); margin-bottom:10px; box-shadow:var(--soft-shadow);"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;"><strong>${a.title}</strong><div><span style="font-size:12px; color:var(--text-muted); margin-right:10px;">${a.date}</span><button type="button" onclick="deleteAnnouncement('${a.id}')" style="background:none; border:none; color:var(--red); font-size:16px; cursor:pointer;" title="Sil">🗑️</button></div></div><p style="font-size:14px; color:var(--text-main); margin-top:5px;">${a.text}</p></div>`).join(''); }
function updateInboxBadge() { const badge = document.getElementById('inbox-badge'); if(!badge || !currentUser || currentUser.role === 'guest') return; const readCount = parseInt(localStorage.getItem(`readAnnCount_${currentUser.email}`)) || 0; const unread = ANNOUNCEMENTS.length - readCount; if(unread > 0) { badge.style.display = 'flex'; badge.innerText = unread; } else badge.style.display = 'none'; }
function openInboxModal() { if(!currentUser) return; localStorage.setItem(`readAnnCount_${currentUser.email}`, ANNOUNCEMENTS.length); updateInboxBadge(); updateBadges(); const list = document.getElementById('inbox-list'); if(ANNOUNCEMENTS.length === 0) list.innerHTML = '<div class="empty-state">Posta kutunuz boş.</div>'; else list.innerHTML = [...ANNOUNCEMENTS].reverse().map(a => `<div style="background:#f8fafc; padding:20px; border-radius:12px; border-left:4px solid var(--primary); margin-bottom:10px;"><strong style="color:var(--bg-dark); font-size:16px;">${a.title}</strong><br><small style="color:var(--text-muted);">${a.date} - Şef: ${a.author}</small><p style="margin-top:10px; font-size:14px; line-height:1.6;">${a.text}</p></div>`).join(''); document.getElementById('inbox-modal').style.display = 'block'; }
function closeInboxModal() { document.getElementById('inbox-modal').style.display = 'none'; }

// 🤖 GEMINI AI (SICAKKANLI ŞEF MODU)
function sendQuickAiCmd(text) { document.getElementById('aiInput').value = text; sendAiMsg(); }
function toggleAiFullscreen() { const aiContainer = document.getElementById('aiAssistantContainer'); const btn = document.getElementById('btn-ai-expand'); aiContainer.classList.toggle('fullscreen'); btn.textContent = aiContainer.classList.contains('fullscreen') ? '✖' : '⛶'; }

async function sendAiMsg() { 
    const inp = document.getElementById('aiInput'); const txt = inp.value.trim(); if(!txt) return;
    const box = document.getElementById('aiMessages'); box.innerHTML += `<div class="msg user"><div class="msg-bubble">${txt}</div></div>`; inp.value = ""; box.scrollTop = box.scrollHeight;
    const loadingId = "ai-loading-" + Date.now(); box.innerHTML += `<div class="msg ai loading" id="${loadingId}"><div class="msg-bubble"><i>MaviTarif Mutfak Zekası reçete ve kiler verilerini analiz ediyor... 👨‍🍳🔍</i></div></div>`;
    box.scrollTop = box.scrollHeight;
    
    if(!geminiApiKey) { document.getElementById(loadingId).remove(); box.innerHTML += `<div class="msg ai"><div class="msg-bubble" style="border-left-color: var(--red);">Gemini API Anahtarı eksik!</div></div>`; return; }
    const activeRecipes = RECIPES.filter(r=>r.status!=='pending').map(r => r.name).join(", "); const criticalStocks = STOCK_ITEMS.filter(i => i.qty <= i.min).map(i => i.name).join(", ");
    const systemPrompt = `Senin adın MaviTarif AI Sous-Chef. MaviTarif mutfak otomasyonunun dijital asistanısın. Kullanıcıya her zaman 'Şefim' diye hitap et. Aşçılık, tarifler ve mutfak yönetimi konusunda uzmansın. Kullanıcı seninle konu dışı sohbet ederse, hal hatır sorarsa veya farklı konular açarsa; asla 'Bunu yapamam' deme! Aksine çok sıcak, esprili, doğal bir mutfak diliyle, sanki o mutfakta yanındaymışsın gibi keyifli sohbet et. Konu dışı sohbetlerde bile mutfak terimleri kullan (örneğin 'Tencere kaynıyor Şefim, ama bu mevzu bambaşka bir baharat istiyor'). Her zaman TÜRKÇE cevap ver. Tarifler: ${activeRecipes}. Riskli stoklar: ${criticalStocks}. Kullanıcı mesajı: ${txt}`;
    
    try { 
        const modelRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + geminiApiKey);
        const modelData = await modelRes.json();
        const availableModel = modelData.models.find(m => m.supportedGenerationMethods.includes('generateContent') && m.name.includes('gemini'));
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${availableModel.name}:generateContent?key=${geminiApiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }) });
        if (!response.ok) throw new Error("API erişim hatası.");
        const data = await response.json(); document.getElementById(loadingId).remove(); let aiText = data.candidates[0].content.parts[0].text;
        box.innerHTML += `<div class="msg ai"><div class="msg-bubble">${aiText.replace(/\n/g, "<br>")}</div></div>`;
    } catch (error) { document.getElementById(loadingId).remove(); box.innerHTML += `<div class="msg ai"><div class="msg-bubble" style="border-left-color: var(--red);"><b>Şefim, tencere bir anlık duraksadı!</b> Teknik bir aksilik oldu, tekrar deneyelim mi?</div></div>`; } 
    box.scrollTop = box.scrollHeight;
}

window.toggleKitchenProductionMode = function() {
    isKitchenMode = !isKitchenMode; const btn = document.getElementById('btn-kitchen-mode'); const sidebar = document.getElementById('main-sidebar'); const layout = document.querySelector('.detail-layout');
    if(isKitchenMode) { btn.innerHTML = '🔙 Odak Modundan Çık'; sidebar.style.display = 'none'; if(layout) layout.style.display = 'block'; if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } 
    else { btn.innerHTML = '👨‍🍳 Pişirme Modunu Aç'; sidebar.style.display = 'flex'; if(layout) layout.style.display = 'flex'; if (document.fullscreenElement) document.exitFullscreen(); }
}

function initApp() {
    goPage('dash', document.getElementById('nav-dash')); filterRecipes();
    if(currentUser && currentUser.role === 'admin') { renderStockTable(); renderUserManagement(); renderAuditLog(); }
    if(currentUser && currentUser.role === 'user') { renderMyRequests(); renderUserDMs(); }
    loadProfile(); renderPendingRecipes(); renderPendingEdits(); renderMyRecipes(); updateBadges();
}

if (document.readyState === 'loading') { document.addEventListener("DOMContentLoaded", startMaviTarif); } else { startMaviTarif(); }
// ==========================================
// 🛡️ MAVİTARİF %100 SUPABASE BAKIM MODU
// ==========================================

const SUPER_ADMIN = 'okulmengen@gmail.com'; 
const TESTER_EMAIL = 'saraczuhal@hotmail.com'; 
let isToggling = false;
window.maintenanceBlockedView = false;

// 🔙 GERİ DÖN VE ÇIKIŞ YAP (Siteden atmama sorununu çözen tam güvenlikli çıkış)
window.handleMaintenanceBack = async function() {
    window.maintenanceBlockedView = false;
    
    // Supabase'den zorla çıkış yap (Müşteriyi dükkandan kesin olarak atar)
    if(window.supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    
    let maintScreen = document.getElementById('maintenance-screen');
    const authScreen = document.getElementById('auth-screen');
    if (maintScreen) maintScreen.style.display = 'none';
    if (authScreen) authScreen.style.display = 'flex';
    
    localStorage.clear(); 
    sessionStorage.clear(); 
    currentUser = null;
    
    // Tarayıcıyı ana sayfaya zorla yönlendir
    window.location.href = "index.html";
}

// 🔌 ŞALTERİ İNDİR / KALDIR
window.toggleMaintenanceMode = async function() {
    if (isToggling) return; 
    isToggling = true;

    if(!currentUser || !currentUser.email || currentUser.email.toLowerCase() !== SUPER_ADMIN) {
        showToast("Bu şalteri sadece Baş Şef indirebilir!", "error");
        isToggling = false;
        return;
    }
    
    try {
        // 1. Supabase'den şalterin şu anki durumunu öğren
        const { data, error } = await supabaseClient.from('site_settings').select('is_maintenance').eq('id', 1).single();
        if (error) throw error;

        // 2. Durumu tam tersine çevir (Açıksa kapat, kapalıysa aç)
        const newState = !data.is_maintenance;

        // 3. Supabase'e yeni durumu kaydet
        const { error: updateError } = await supabaseClient.from('site_settings').update({ is_maintenance: newState }).eq('id', 1);
        if (updateError) throw updateError;

        if (newState) {
            showToast("Bakım Modu AKTİF. Dükkan kilitlendi.", "warning");
        } else {
            showToast("Bakım Modu KAPATILDI. Mutfak herkese açık.", "success");
        }
        
        checkMaintenanceStatus(); // Ekranları anında güncelle
    } catch (err) {
        console.error("Şalter hatası:", err);
        showToast("Veritabanı bağlantı hatası!", "error");
    } finally {
        setTimeout(() => { isToggling = false; }, 1000); 
    }
}

// 🕵️ AKILLI KALKAN (Tıklamaları Engelleme)
document.addEventListener('click', async function(e) {
    if (currentUser) return; // Kullanıcı zaten içerdeyse karışma

    // Eğer Supabase bağlı değilse işlem yapma
    if(!window.supabaseClient) return;

    const target = e.target.closest('button') || e.target.closest('a');
    if (!target) return; 

    const text = (target.innerText || '').toLowerCase();
    const id = (target.id || '').toLowerCase();
    const onclick = (target.getAttribute('onclick') || '').toLowerCase();
    
    const isRegister = text.includes('kayıt') || id.includes('register') || onclick.includes('register');
    const isForgot = text.includes('şifre') || id.includes('forgot') || onclick.includes('forgot');
    const isGuest = text.includes('misafir') || id.includes('guest') || onclick.includes('guest');

    if (isRegister || isForgot || isGuest) {
        // Sadece giriş yapılmaya çalışıldığında Supabase'den anlık kontrol et
        const { data } = await supabaseClient.from('site_settings').select('is_maintenance').eq('id', 1).single();
        
        if (data && data.is_maintenance) {
            e.preventDefault(); 
            e.stopPropagation(); 
            
            window.maintenanceBlockedView = true; 
            let maintScreen = document.getElementById('maintenance-screen');
            const authScreen = document.getElementById('auth-screen');
            if (authScreen) authScreen.style.display = 'none';
            if (maintScreen) maintScreen.style.display = 'flex';
            
            showToast("Sistem bakımda. Yeni kayıt veya misafir girişi kapalı.", "warning");
        }
    }
}, true); 

// 🔄 SÜREKLİ KONTROL MERKEZİ
window.checkMaintenanceStatus = async function() {
    if (!window.supabaseClient) return;

    // Supabase'den gerçek durumu çek
    const { data, error } = await supabaseClient.from('site_settings').select('is_maintenance').eq('id', 1).single();
    if (error || !data) return;

    const isMaintenanceOn = data.is_maintenance;
    
    let maintScreen = document.getElementById('maintenance-screen');
    if(!maintScreen) {
        maintScreen = document.createElement('div');
        maintScreen.id = 'maintenance-screen';
        maintScreen.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:var(--bg-dark, #0f172a); z-index:99999; flex-direction:column; justify-content:center; align-items:center; color:white; text-align:center; padding:20px;';
        
        maintScreen.innerHTML = `
            <div style="font-size:80px; margin-bottom:20px;">🚧</div>
            <h1 style="color:var(--amber, #f59e0b); margin-bottom:15px; font-size:32px;">Bakım Molası</h1>
            <p style="font-size:18px; color:#cbd5e1; max-width:500px; line-height:1.6; margin-bottom: 25px;">Sistemi size daha iyi hizmet verebilmek için güncelliyoruz. Lütfen daha sonra tekrar deneyin.</p>
            <button onclick="handleMaintenanceBack()" style="padding: 10px 25px; font-size: 16px; font-weight: bold; background: var(--primary, #3b82f6); color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🔙 Geri Dön</button>
        `;
        document.body.appendChild(maintScreen);
    }

    const appContainer = document.getElementById('main-app-container');
    const authScreen = document.getElementById('auth-screen');
    
    if(!currentUser) {
        if (window.maintenanceBlockedView) {
            maintScreen.style.display = 'flex';
            if(authScreen) authScreen.style.display = 'none';
        } else {
            maintScreen.style.display = 'none'; 
            if(authScreen) authScreen.style.display = 'flex'; 
        }
        if(appContainer) appContainer.style.display = 'none';
        return;
    }

    const isVipUser = currentUser.email && (currentUser.email.toLowerCase() === SUPER_ADMIN || currentUser.email.toLowerCase() === TESTER_EMAIL);

    if (isMaintenanceOn) {
        if (isVipUser) {
            window.maintenanceBlockedView = false;
            maintScreen.style.display = 'none';
            if(appContainer) appContainer.style.display = 'flex';
            if(authScreen) authScreen.style.display = 'none';
        } else {
            // Normal kullanıcı içerideyken bakım modu açılırsa onu da engelle
            maintScreen.style.display = 'flex';
            if(appContainer) appContainer.style.display = 'none';
            if(authScreen) authScreen.style.display = 'none';
        }
    } else {
        maintScreen.style.display = 'none';
    }
};

// Supabase'i yormamak için süreyi 10 saniyeye çıkardık (Ücretsiz paketi korur)
setInterval(checkMaintenanceStatus, 10000);
setTimeout(checkMaintenanceStatus, 1000); // İlk açılışta hemen kontrol et
