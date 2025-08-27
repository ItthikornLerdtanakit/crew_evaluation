import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/esm/Table';

import Navbarback from './component/navbar/navbarback';
import Navbarlogout from './component/navbar/navbarlogout';
import Footer from './component/footer';

import { loading } from './component/sweetalerttwo';
import { get_evaluator } from './component/connectdatabase';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { GoChevronRight } from 'react-icons/go';

const Crew = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('tokens');
    const decoded = jwtDecode(token);
    
    useEffect(() => {
        document.title = 'Crew Evaluation List';
        get_database();
    }, []);

    const [Employee, setEmployee] = useState(null);
    const get_database = async () => {
        loading();
        const result = await get_evaluator(decoded.crew_level, decoded.crew_id, location.state);
        setEmployee(result);
        loading('success');
    }

    const redirect = (data) => {
        if ((decoded.crew_level === 'level_4' && location.state === 'all') || decoded.crew_level === 'level_5') {
            navigate('/evaluatelist', { state: data });
        } else if (data.status) {
            let data_crew = data;
            // เพิ่ม key ใหม่
            data_crew = {
                ...data_crew,
                evaluator_name: decoded.crew_nameen
            };
            navigate('/result', { state: data_crew });
        } else {
            navigate('/evaluates', { state: data });
        }
    }

    return (
        <Container fluid>
        {decoded.crew_level === 'level_2' || decoded.crew_level === 'level_3' || decoded.crew_level === 'level_4' ? (
            <Navbarback />
        ) : (
            <Navbarlogout />
        )}
        <Row style={{flex: 1}}>
            <Col md={12}>
                <Row className='mt-4'>
                    <p className='titles'>Crew Evaluation List</p>
                </Row>
                <Row className='midpoint cardtext'>
                    <div className='card'>
                        <Row>
                            <Col className='col-5'>
                                <p className='headertext mb-2'>NOKID:</p>
                                <p className='headertext mb-2'>Position:</p>
                                <p className='headertext mb-2'>Round:</p>
                            </Col>
                            <Col className='col-7'>
                                <p className='mb-2'>{decoded.crew_code}</p>
                                <p className='mb-2'>{decoded.crew_nameen}</p>
                                <p>{'2/2025'}</p>
                            </Col>
                        </Row>
                    </div>
                </Row>
                <Row className='midpoint'>
                    <Col md={7}>
                        <Table className='tables'>
                            <thead className='theadtext'>
                                <tr>
                                    <th style={{verticalAlign: 'middle'}}>NokID</th>
                                    <th style={{verticalAlign: 'middle'}}>Name</th>
                                    <th style={{verticalAlign: 'middle'}}>Result</th>
                                    <th style={{width: '40px'}}></th>
                                </tr>
                            </thead>
                            <tbody className='tbodytext'>
                                {Employee && Employee.map(data => (
                                    <tr key={data.crew_id} style={{cursor: 'pointer'}} onClick={() => redirect(data)}>
                                        <td style={{verticalAlign: 'middle'}}>{data.crew_code}</td>
                                        <td style={{verticalAlign: 'middle'}}>{data.crew_nameen}</td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                            {data.status > 0 ? (
                                                <span className='checkicon' style={{color: data.evaluation_status === 'Pass' ? 'green' : 'red'}}>{data.evaluation_status}</span>
                                            ) : null}
                                        </td>
                                        <td style={{fontSize: '20px', verticalAlign: 'middle', padding: 0}}><GoChevronRight /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Footer />
    </Container>

    )
}

export default Crew;