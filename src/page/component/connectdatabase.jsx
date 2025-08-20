import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// const ipaddress = 'https://crewnokairbackend.maxitthikorn.online';
const ipaddress = 'http://172.20.10.3:3001';

// เข้าสู่ระบบสำหรับการประเมิน (ส่งไปหาระบบหลังบ้าน)
export const login = async (nokid, password) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_LOGIN, { nokid, password });
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
        const response = await axios.get(ipaddress + import.meta.env.VITE_PART);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลคำถามการประเมิน
export const get_evaluation = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_EVAL_QUESTION);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลผู้ประเมิน
export const get_evaluator = async (level, supervisor) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_EVALUATOR, { level, supervisor });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลผู้ประเมินรายคน
export const get_evaluator_person = async (crewid) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_EVALUATOR_PERSON, { crewid });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกข้อมูลการประเมิน
export const save_evaluation = async (employee, supervisor, evaluation_group, evaluation_item, total, status) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_EVALUATION, { employee, supervisor, evaluation_group, evaluation_item, total, status });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูบผลการประเมินของลูกเรือ
export const get_result_evaluation = async (id) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_RESULT_EVALUATION, { id });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูบผลการประเมินของลูกเรือสำหรับหัวข้อใหญ่
export const get_result_evaluation_group = async (id) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_RESULT_EVALUATION_GROUP, { id });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูบผลการประเมินของลูกเรือสำหรับหัวข้อย่อย
export const get_result_evaluation_item = async (id) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_RESULT_EVALUATION_ITEM, { id });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}