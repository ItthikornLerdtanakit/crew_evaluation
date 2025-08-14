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
        let data_crew = location.state;
        delete data_crew.evaluation_totalscore;
        // เพิ่ม key ใหม่
        data_crew = {
            ...data_crew,
            evaluator_name: data.crew_nameen,
            evaluation_totalscore: data.evaluation_totalscore // ใส่ใหม่แทนของเก่า
        };
        navigate('/result', { state: data_crew });
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
                {Employee && Employee.length > 1 ? (
                    <>
                        <Row className='mt-5' style={{textAlign: 'center'}}>
                            <h3>Comparison of Scores Table</h3>
                        </Row>
                        <Row className='midpoint'>
                            <Col md={7}>
                                <Table className='tables'>
                                    <thead className='theadtext'>
                                        <tr>
                                            <th style={{verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', textAlign: 'center'}}>Name</th>
                                            <th className='coms' style={{verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', textAlign: 'center'}}>PART 1: SAFETY COMPLIANCE</th>
                                            <th className='coms' style={{verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', textAlign: 'center'}}>PART 2: SERVICE DELIVERY</th>
                                            <th className='coms' style={{verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', textAlign: 'center'}}>PART 3: PROFESSIONAL CREW</th>
                                            <th className='coms' style={{verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', textAlign: 'center'}}>PART 4: LEADERSHIP SKILLS</th>
                                        </tr>
                                    </thead>
                                    <tbody className='tbodytext'>
                                        {Employee && Employee.length > 0 ? Employee.map(data => (
                                            <tr key={data.crew_id}>
                                                <td style={{verticalAlign: 'middle'}}>{data.crew_nameen}</td>
                                                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{data.part1}</td>
                                                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{data.part2}</td>
                                                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{data.part3}</td>
                                                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{data.part4 || '-'}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} style={{fontSize: '16px', fontWeight: 600, textAlign: 'center'}}>No evaluator list available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                ) : null}
            </Col>
        </Row>
        <Footer />
    </Container>

    )
}

export default Evaluatelist;