import { useNavigate } from 'react-router-dom';

// นำเข้ามาจาก Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/esm/Container';

import logo from '../../../assets/image/logofull.png';

import { BsChevronLeft } from 'react-icons/bs';

const Navbars = () => {
    const navigate = useNavigate();

    return (
        <nav>
            <Row>
                <Navbar className='navbars'>
                    <Container>
                        <Row className='w-100'>
                        <Col className='col-4 d-flex align-items-center' style={{fontSize: '24px'}}>
                            <button style={{ all: 'unset', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => navigate(-1)}><BsChevronLeft /></button>
                        </Col>
                        <Col className='col-4 d-flex justify-content-center align-items-center'>
                            <img className='logonokair' src={logo} alt='logo navbar' />
                        </Col>
                    </Row>
                    </Container>
                </Navbar>
            </Row>
        </nav>
    )
}

export default Navbars;