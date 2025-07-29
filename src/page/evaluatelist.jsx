import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/esm/Table';

import Navbars from './component/navbar/navbarback';
import Footer from './component/footer';

import { loading } from './component/sweetalerttwo';
import { get_evaluator_person } from './component/connectdatabase';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { GoChevronRight } from 'react-icons/go';

const Evaluatelist = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = 'Leader Evaluation List';
        if (!location.state) {
            return navigate(-1);
        }
        get_database();
    }, []);

    const [Employee, setEmployee] = useState(null);
    const get_database = async () => {
        loading();
        const result = await get_evaluator_person(location.state.crew_id);
        setEmployee(result);
        loading('success');
    }

    const redirect = (data) => {
        navigate('/result', { state: data });
    }

    return (
        <Container fluid>
        <Navbars />
        <Row style={{flex: 1}}>
            <Col md={12}>
                <Row className='titles mt-4'>
                    <p>Leader Evaluation List</p>
                </Row>
                <Row className='midpoint'>
                    <Col md={7}>
                        <Table className='tables'>
                            <thead className='theadtext'>
                                <tr>
                                    <th style={{verticalAlign: 'middle'}}>NokID</th>
                                    <th style={{verticalAlign: 'middle'}}>Name</th>
                                    <th style={{verticalAlign: 'middle'}}>Score</th>
                                    <th style={{width: '40px'}}></th>
                                </tr>
                            </thead>
                            <tbody className='tbodytext'>
                                {Employee && Employee.length > 0 ? Employee.map(data => (
                                    <tr key={data.crew_id} style={{cursor: 'pointer'}} onClick={() => redirect(data)}>
                                        <td style={{verticalAlign: 'middle'}}>{data.crew_code}</td>
                                        <td style={{verticalAlign: 'middle'}}>{data.crew_nameen}</td>
                                        <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{data.evaluation_totalscore}</td>
                                        <td style={{fontSize: '20px', verticalAlign: 'middle', padding: 0}}><GoChevronRight /></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{fontSize: '16px', fontWeight: 600, textAlign: 'center'}}>No evaluator list available.</td>
                                    </tr>
                                )}
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

export default Evaluatelist;