import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { customStylesYear } from '../css/styles';
import Navbarback from './component/navbar/navbarback';
import Navbarlogout from './component/navbar/navbarlogout';
import Footer from './component/footer';
import { loading } from './component/sweetalerttwo';
import { get_result_evaluation } from './component/connectdatabase';

import { BsCaretDownFill, BsCaretRightFill } from 'react-icons/bs';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('tokens');
    const decoded = jwtDecode(token);

    useEffect(() => {
        document.title = 'Home';
        get_database();
    }, []);

    const [Evaluation, setEvaluation] = useState(null);
    const [Round, setRound] = useState(null);
    const [Year, setYear] = useState();
    const [SelectedYear, setSelectedYear] = useState(null);
    const get_database = async () => {
        loading();
        const result = await get_result_evaluation(decoded.crew_id);
        const newresult = result.map(item => ({
            ...item,
            round: item.evaluation_round.replace('-', '/')
        }));
        setEvaluation(newresult);
        const rounds = [...new Set(newresult.map(item => item.round))];
        setRound(rounds);
        const round_years = [...new Set(rounds.map(r => r.split('/')[1]))];
        const yearOptions = round_years.map(year => ({ value: year, label: 'Year: ' + year }));
        setYear(yearOptions);
        setSelectedYear(yearOptions[0]);
        const round = rounds.filter(item => item.split('/')[1] === yearOptions[0].value);
        setFilterRound(round);
        loading('success');
    }

    // เมื่อมีการเลือก select แล้วให้ทำการเปลี่ยนแปลง
    const [FilterRound, setFilterRound] = useState(null);
    const selectonchange = (obj) => {
        setSelectedYear(obj);
        const round = Round.filter(item => item.split('/')[1] === obj.value);
        setFilterRound(round);
    }

    // ทำปุ่มแสดง/ซ่อนกล่องข้อความ
    const [openRounds, setOpenRounds] = useState([]);
    useEffect(() => {
        if (FilterRound && FilterRound.length > 0) {
            setOpenRounds(FilterRound);
        }
    }, [FilterRound]);
    const toggleRound = (round) => {
        if (openRounds.includes(round)) {
            setOpenRounds(openRounds.filter(r => r !== round));
        } else {
            setOpenRounds([...openRounds, round]);
        }
    };

    // เมื่อกดไปยังหน้า result โดยการส่งข้อมูลไปหน้านั้นด้วย
    const redirect = (data) => {
        let data_new = data;
        // เพิ่ม key ใหม่
        data_new = {
            ...data_new,
            crew_level: decoded.crew_level,
            evaluator_name: data.crew_nameen,
        };
        navigate('/result', { state: data_new });
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
                    <Row>
                        <Col md={12} className='mb-2'>
                            <Select options={Year} styles={customStylesYear} isSearchable={false} value={SelectedYear} onChange={selectonchange} placeholder='Select Your Years' />
                        </Col>
                    </Row>
                    {FilterRound && FilterRound.length > 0 ? FilterRound.map((round) => (
                        <div key={round}>
                            <Row className='title_round'>
                                <Col className='col-12 mt-2'>
                                    <div className="evaluation-header">
                                        <span>Evaluation Round - {round}</span>
                                        <button className='toggle-button' onClick={() => toggleRound(round)}>
                                            {openRounds.includes(round) ? <BsCaretDownFill /> : <BsCaretRightFill />}
                                        </button>
                                    </div>
                                </Col>
                                <Col className='col-2 mt-2'>
                                </Col>
                            </Row>
                            {openRounds.includes(round) && (
                            <Row className='mt-2 cardtext'>
                                {Evaluation && Evaluation.filter(item => item.round === round).map(data => (
                                    <div key={data.evaluation_id} className='card'>
                                        <Row>
                                            <Col className='col-5'>
                                                <p className='headertext mb-2'>Leader Name:</p>
                                                <p className='headertext mb-2'>Date Evaluation:</p>
                                                <p className='headertext mb-2'>Score:</p>
                                                <p className='headertext mb-2'>Evaluation Status:</p>
                                            </Col>
                                            <Col className='col-7'>
                                                <p className='mb-2'>{data.crew_nameen}</p>
                                                <p className='mb-2'>{data.evaluation_created_at}</p>
                                                <p className='mb-2'>{data.evaluation_totalscore.toFixed(1)} / 5.0</p>
                                                <p style={{color: data.evaluation_status === 'Pass' ? 'green' : 'red'}} className='mb-2'>{data.evaluation_status}</p>
                                            </Col>
                                            <Col className='col-12' style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <button className='textlink' onClick={() => redirect(data)}>
                                                    Evaluation details {'>>'}
                                                </button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Row>
                            )}
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