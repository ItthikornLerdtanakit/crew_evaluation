import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ipaddress = 'https://crewnokairbackend.maxitthikorn.online';

// เข้าสู่ระบบสำหรับการประเมิน (ส่งไปหาระบบหลังบ้าน)
export const login = async (nokid, password) => {
    try {
        const response = await axios.post(ipaddress + '/api/login', { nokid, password });
        if (response.data.auth === false) {
            return response.data;
        } else {
            const token = response.data.token;
            const decoded = jwtDecode(token);
            localStorage.setItem('tokens', token);
            return { auth: response.data.auth, crew_level: decoded.crew_level };
        }
    } catch (error) {
        console.error(error);
    }
}

// ออกจากระบบและเคลียร์ session ทุกอย่าง
export const logout = async () => {
    localStorage.removeItem('tokens');
    window.location.href = '/';
}

// ดึงข้อมูลชื่อ Part
export const get_part = async () => {
    try {
        const response = await axios.get(ipaddress + '/api/part');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลคำถามการประเมิน
export const get_evaluation = async () => {
    try {
        const response = await axios.get(ipaddress + '/api/eval_question');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลผู้ประเมิน
export const get_evaluator = async (level, supervisor) => {
    try {
        const response = await axios.post(ipaddress + '/api/evaluator', { level, supervisor });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลผู้ประเมินรายคน
export const get_evaluator_person = async (crewid) => {
    try {
        const response = await axios.post(ipaddress + '/api/evaluator_person', { crewid });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกข้อมูลการประเมิน
export const save_evaluation = async (employee, supervisor, part, evaluation_group, evaluation_item, total) => {
    try {
        const response = await axios.post(ipaddress + '/api/save_evaluation', { employee, supervisor, part, evaluation_group, evaluation_item, total });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูบผลการประเมินของลูกเรือ
export const get_result_evaluation = async (id) => {
    try {
        const response = await axios.post(ipaddress + '/api/result_evaluation', { id });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูบผลการประเมินของลูกเรือสำหรับหัวข้อใหญ่
export const get_result_evaluation_group = async (id) => {
    try {
        const response = await axios.post(ipaddress + '/api/result_evaluation_group', { id });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูบผลการประเมินของลูกเรือสำหรับหัวข้อย่อย
export const get_result_evaluation_item = async (id) => {
    try {
        const response = await axios.post(ipaddress + '/api/result_evaluation_item', { id });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}