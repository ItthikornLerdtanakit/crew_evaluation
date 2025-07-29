import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import Navbars from './component/navbar/navbar';
import Footer from './component/footer';
import { login } from './component/connectdatabase';
import { alertsmall } from './component/sweetalerttwo';

import logo from '../assets/image/logo.png';

import { BiEnvelope, BiLock } from 'react-icons/bi';

const Index = () => {
    const navigate = useNavigate();

    const [Nokid, setNokid] = useState('');
    const [Password, setPassword] = useState('');
    const [Remember, setRemember] = useState(null);
    useEffect(() => {
        document.title = 'Login';
        const login_data = localStorage.getItem(import.meta.env.VITE_LOGINSESSION) ? JSON.parse(localStorage.getItem(import.meta.env.VITE_LOGINSESSION)) : null;
        if (login_data) {
            setNokid(login_data.nokid);
            setPassword(login_data.passwords);
            setRemember(login_data.remember);
        }
    }, []);

    // ตรวจจับว่าได้ทำการกรอกอีเมลครบแล้วหรือไม่
    const txtonchange = (event) => {
        if (event.target.id === 'nokid_login') {
            if (event.target.value) {
                // ฟังก์ชันที่ใช้ในการตรวจสอบอีเมลเมื่อมีการกรอกข้อมูล
                document.getElementById('inputgroups_nokid').style.border = '1px solid rgb(222, 226, 230)';
                document.getElementById('textalertnokid').style.display = 'none';
            } else {
                document.getElementById('inputgroups_nokid').style.border = '2px solid red';
                document.getElementById('textalertnokid').style.display = 'block';
            }
        } else if (event.target.id === 'password_login') {
            if (event.target.value) {
                document.getElementById('inputgroups_password').style.border = '1px solid rgb(222, 226, 230)';
                document.getElementById('textalertpassword').style.display = 'none';
            } else {
                document.getElementById('inputgroups_password').style.border = '2px solid red';
                document.getElementById('textalertpassword').style.display = 'block';
            }
        }
    }

    // เช็ึคค่าว่าง
    const checkvalue = (nokid, passwords) => {
        if (!nokid.value) {
            document.getElementById('inputgroups_nokid').style.border = '2px solid red';
            document.getElementById('textalertnokid').style.display = 'block';
        }
        if (!passwords.value) {
            document.getElementById('inputgroups_password').style.border = '2px solid red';
            document.getElementById('textalertpassword').style.display = 'block';
        }
    }

    // ปุ่มเข้าสู่ระบบ
    const btn_login = async () => {
        const nokid = document.getElementById('nokid_login');
        const passwords = document.getElementById('password_login');
        const remember = document.getElementById('remember');
        if (!nokid.value || !passwords.value) {
            checkvalue(nokid, passwords);
        } else {
            const result_login = await login(nokid.value, passwords.value);
            if (result_login.auth === false) {
                alertsmall('error', 'NokID or Password Incorrect');
            } else {
                if (remember.checked === true) {
                    const login_data = { nokid: nokid.value, passwords: passwords.value, remember: true };
                    localStorage.setItem(import.meta.env.VITE_LOGINSESSION, JSON.stringify(login_data));
                } else {
                    localStorage.removeItem(import.meta.env.VITE_LOGINSESSION);
                }
                if (result_login.crew_level === 'level_1') {
                    navigate('/home');
                } else if (result_login.crew_level === 'level_2' || result_login.crew_level === 'level_3') {
                    navigate('/menu');
                } else {
                    navigate('/crew');
                }
            }
        }
    }
    
    return (
        <Container fluid id='footer'>
            <Navbars />
            <Row style={{flex: 1}} className='midpoint'>
                <Col md={4}>
                    <Col md={12} className='midpoint'>
                        <img src={logo} alt='logo noair' className='logo' />
                    </Col>
                    <Col md={12} className='midpoint mt-2'>
                        <b style={{fontSize: '30px'}}>Login</b>
                    </Col>
                    <Col md={12} className='midpoint'>
                        <p>Crew Assessment Website</p>
                    </Col>
                    <Col md={12} className='midpoint mt-3'>
                        <Form style={{width: '100%'}} onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Nok ID</Form.Label>
                                <InputGroup className='inputgroups' id='inputgroups_nokid'>
                                    <InputGroup.Text className='inputicon'><BiEnvelope /></InputGroup.Text>
                                    <Form.Control type='text' id='nokid_login' className='inputtext' onChange={txtonchange} defaultValue={Nokid} placeholder='Enter your Nok ID' />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className='col-12 mt-1' id='textalertnokid' style={{display: 'none'}}>
                        <p style={{color: 'red'}}>Please enter your nokid address correctly.</p>
                    </Col>
                    <Col md={12} className='midpoint mt-2'>
                        <Form style={{width: '100%'}} onSubmit={(e) => { e.preventDefault(); }}>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <InputGroup className='inputgroups' id='inputgroups_password'>
                                    <InputGroup.Text className='inputicon'><BiLock /></InputGroup.Text>
                                    <Form.Control type='password' id='password_login' className='inputtext' onChange={txtonchange} defaultValue={Password} placeholder='Enter your password' />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className='col-12 mt-1' id='textalertpassword' style={{display: 'none'}}>
                        <p style={{color: 'red'}}>Please enter your password correctly.</p>
                    </Col>
                    <Col className='col-12 mt-3'>
                        <Row>
                            <Col className='col-6'>
                                <label className='custom-radio'>
                                    <input type='checkbox' id='remember' className='radio-input' defaultChecked={Remember} />
                                    <span className='checkmark'></span>
                                    <b>Remember me</b>
                                </label>
                            </Col>
                            <Col className='col-6' style={{textAlign: 'right', marginTop: '10px', paddingRight: '20px'}}>
                                <button className='forgetpassword' style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}><b>Forgotten Password</b></button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={12} className='mt-5 midpoint'>
                        <Button variant='warning' className='btns' onClick={btn_login}>Login</Button>
                    </Col>
                </Col>
            </Row>
            <Footer />
        </Container>
    )
}

export default Index;