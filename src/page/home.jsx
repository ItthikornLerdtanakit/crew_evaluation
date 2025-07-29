import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navbarback from './component/navbar/navbarback';
import Navbarlogout from './component/navbar/navbarlogout';
import Footer from './component/footer';
import { loading } from './component/sweetalerttwo';
import { get_result_evaluation } from './component/connectdatabase';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('tokens');
    const decoded = jwtDecode(token);

    useEffect(() => {
        document.title = 'Home';
        get_database();
    }, []);

    const [Evaluation, setEvaluation] = useState(null);
    const [Round, setRound] = useState(null)
    const get_database = async () => {
        loading();
        const result = await get_result_evaluation(decoded.crew_id);
        const newresult = result.map(item => ({
            ...item,
            round: getround(item.evaluation_created_at_date)
        }));
        const rounds = [...new Set(newresult.map(item => item.round))];
        setRound(rounds);
        setEvaluation(newresult);
        loading('success');
    }

    const getround = (dateString) => {
        const date = new Date(dateString); // สร้าง Date object จาก string เช่น '2025-07-22'
        const month = date.getMonth() + 1; // getMonth() จะเริ่มที่ 0 (มกราคม = 0) ต้อง +1
        const year = date.getFullYear();
        return (month >= 1 && month <= 6) ? `1/${year}` : `2/${year}`;
    }

    return (
        <Container fluid>
        {decoded.crew_level === 'level_2' || decoded.crew_level === 'level_3' ? (
            <Navbarback />
        ) : (
            <Navbarlogout />
        )}
        <Row style={{flex: 1}}>
            <Col md={12}>
                <Row className='titles mt-4'>
                    <p>Crew Evaluation</p>
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
                {Round && Round.length > 0 ? Round.map((round) => (
                    <div key={round}>
                        <Row>
                            <Col md={12} className='title_round mt-2'>
                                <p>Evaluation Round - {round}</p>
                            </Col>
                        </Row>
                        <Row className='mt-2 cardtext'>
                            {Evaluation && Evaluation.filter(item => item.round === round).map(data => (
                                <div key={data.evaluation_id} className='card'>
                                    <Row>
                                        <Col className='col-5'>
                                            <p className='headertext mb-2'>Leader Name:</p>
                                            <p className='headertext mb-2'>Date Evaluation:</p>
                                            <p className='headertext mb-2'>Score:</p>
                                        </Col>
                                        <Col className='col-7'>
                                            <p className='mb-2'>{data.crew_nameen}</p>
                                            <p className='mb-2'>{data.evaluation_created_at}</p>
                                            <p className='mb-2'>{data.evaluation_totalscore} / 5.0</p>
                                        </Col>
                                        <Col className='col-12' style={{display: 'flex', justifyContent: 'flex-end'}}>
                                            <button className='textlink' onClick={() => navigate('/result', { state: data })}>
                                                Assessment details {'>>'}
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </Row>
                    </div>
                )) : (
                    <Row>
                        <Col md={12} className='midpoint'>
                            <p className='mt-4' style={{fontSize: '18px', color: 'gray'}}>No evaluation results available.</p>
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
        <Footer />
    </Container>

    )
}

export default Home;