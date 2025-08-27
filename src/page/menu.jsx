import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Navbars from './component/navbar/navbarlogout';
import Footer from './component/footer';

const Menu = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('tokens');
    const decoded = jwtDecode(token);
    
    useEffect(() => {
        document.title = 'Menu';
    }, []);

    return (
        <Container fluid>
        <Navbars />
        <Row style={{flex: 1}}>
            <Col md={12}>
                <Row className='titles mt-4'>
                    <p>Crew Evaluation Menu</p>
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
                <Row>
                    <Col xxl={2}>
                        <Row>
                            <Col md={12} className='title_round mt-2'>
                                <p>Conduct Evaluation</p>
                            </Col>
                            <Col md={12} className='mb-2 midpoint'>
                                <Button variant='warning' style={{height: '85px', width: '250px', fontSize: '22px'}} onClick={() => navigate('/crew', { state: 'person' })}>Conduct Evaluation</Button>
                            </Col>
                        </Row>
                    </Col>
                    {decoded.crew_level === 'level_2'  || decoded.crew_level === 'level_3' ? (
                        <Col xxl={2}>
                            <Row>
                                <Col md={12} className='title_round mt-2'>
                                    <p>Evaluation Results</p>
                                </Col>
                                <Col md={12} className='mb-2 midpoint'>
                                    <Button variant='warning' style={{height: '85px', width: '250px', fontSize: '22px'}} onClick={() => navigate('/home')}>Evaluation Results</Button>
                                </Col>
                            </Row>
                        </Col>
                    ) : null}
                    {decoded.crew_level === 'level_4' ? (
                        <Col xxl={2}>
                            <Row>
                                <Col md={12} className='title_round mt-2'>
                                    <p>Evaluation Results All</p>
                                </Col>
                                <Col md={12} className='mb-2 midpoint'>
                                    <Button variant='warning' style={{height: '85px', width: '250px', fontSize: '22px'}} onClick={() => navigate('/crew', { state: 'all' })}>Evaluation Results</Button>
                                </Col>
                            </Row>
                        </Col>
                    ) : null}
                </Row>
            </Col>
        </Row>
        <Footer />
    </Container>

    )
}

export default Menu;