// AuthGuard.jsx
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// กติกาสิทธิ์ของแต่ละ level (แก้ได้ที่นี่)
const ACCESS = {
    level_1: { allowed: ['/home', '/result'], default: '/home' },
    level_2: { allowed: ['/menu', '/home', '/crew', '/evaluates', '/result'], default: '/menu' },
    level_3: { allowed: ['/menu', '/home', '/crew', '/evaluates', '/result'], default: '/menu' },
    level_4: { allowed: ['/menu', '/crew', '/evaluates', '/evaluatelist', '/result'], default: '/menu' },
    level_5: { allowed: ['/crew', '/evaluatelist', '/result'], default: '/crew' },
};

// คีย์ token ใน localStorage
const TOKEN_KEY = 'tokens';

// หน้าล็อกอิน (index.jsx)
const LOGIN_PATHS = new Set(['/', '/index']);

// ตัด / ท้าย path ให้เทียบง่าย
const normalizePath = (p) => {
    if (!p) return '/';
    const s = p.replace(/\/+$/, '');
    return s.length ? s : '/';
};

// อ่าน level จาก JWT (รองรับ crew_level หรือ level)
const getLevelFromToken = (token) => {
    try {
        const payload = jwtDecode(token) || {};
        return String(payload.crew_level || payload.level || '').toLowerCase();
    } catch {
        return null;
    }
};

// เช็กสิทธิ์ตาม prefix (ตรง path หรือเป็น path ย่อย)
const hasAccess = (level, path) => {
    const rule = ACCESS[level];
    if (!rule) return false;
    return rule.allowed.some((base) => path === base || path.startsWith(base + '/'));
};

const AuthGuard = () => {
    const path = normalizePath(useLocation().pathname);
    const token = localStorage.getItem(TOKEN_KEY);
    const isLoginPage = LOGIN_PATHS.has(path);
    // ยังไม่ล็อกอินให้เข้าได้เฉพาะหน้า /
    if (!token) return isLoginPage ? <Outlet /> : <Navigate to='/' replace />;
    // มี token ให้หา level และกติกา
    const level = getLevelFromToken(token);
    const rule = ACCESS[level];
    // token เสีย หรือ level ไม่รู้จักให้กลับหน้า /
    if (!rule) return <Navigate to='/' replace />;
    // ล็อกอินแล้ว ไม่ให้เข้า / (index) ให้ส่งไป default ของ level
    if (isLoginPage) return <Navigate to={rule.default} replace />;
    // มีสิทธิ์ → แสดงหน้า; ไม่มีสิทธิ์ ให้ส่งไป default ของ level
    return hasAccess(level, path) ? <Outlet /> : <Navigate to={rule.default} replace />;
};

export default AuthGuard;
