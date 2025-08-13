import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import { BsCheckLg } from 'react-icons/bs';

import { loading } from './component/sweetalerttwo';
import { customStylesPart } from '../css/styles';
import Navbars from './component/navbar/navbarback';
import Footer from './component/footer';
import { get_part, get_evaluation, get_result_evaluation_group, get_result_evaluation_item } from './component/connectdatabase';
import Modalviewcomment from './component/modal/modalviewcomment';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // โหลดข้อมูลเมื่อเริ่มต้น
    const [Employee, setEmployee] = useState({});
    useEffect(() => {
        document.title = 'Crew Evaluation Result';
        if (!location.state) {
            return navigate(-1);
        }
        setEmployee(location.state);
        get_database(location.state.evaluation_id);
    }, []);

    // ดึวข้อมูลจากฐานข้อมูลออกมา
    const [Part, setPart] = useState('');
    const [SelectedPartID, setSelectedPartID] = useState(null);
    const [SelectedPart, setSelectedPart] = useState(null);
    const [Eval, setEval] = useState('');
    const [EvalGroupResult, setEvalGroupResult] = useState(null);
    const [EvalGroupItem, setEvalGroupItem] = useState(null);
    const get_database = async (eval_id) => {
        loading();
        const result_part = await get_part();
        setSelectedPartID(result_part[0].part_id)
        setSelectedPart(result_part[0].part_name);
        let partfilter;
        if (location.state.crew_level === 'level_1') {
            partfilter = await result_part.filter(item => item.part_no !== 'part4');
        } else {
            partfilter = result_part;
        }
        const options = partfilter.map(part => ({
            value: part.part_id,
            label: part.part_name
        }));
        setPart(options);
        const results = await get_evaluation();
        setEval(results);
        const result_eval_group = await get_result_evaluation_group(eval_id);
        setEvalGroupResult(result_eval_group);
        const result_eval_item = await get_result_evaluation_item(eval_id);
        setEvalGroupItem(result_eval_item);
        loading('success');
    }

    // เมื่อมีการเปลี่ยน Part
    const partonchange = (selectedOption) => {
        setSelectedPartID(selectedOption.value);
        setSelectedPart(selectedOption.label); // เก็บข้อมูลของตัวเลือกที่เลือก
    };

    // Modal and comment functionality
    const [showModal, setShowModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [commentText, setCommentText] = useState('');
    const CommentEval = (group, comment) => {
        setSelectedGroup(group);
        setCommentText(comment);
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);
  
    return (
        <Container fluid id='footer'>
            <Navbars />
            <Row style={{flex: 1}}>
                <Col md={12}>
                    <Row className='titles mt-4'>
                        <p>Crew Evaluation Result</p>
                    </Row>
                    <Row className='mt-2 midpoint cardtext'>
                        <div key={Employee.nokid} className='card'>
                            <Row>
                                <Col className='col-5'>
                                    <p className='headertext mb-2'>Name:</p>
                                    <p className='headertext mb-2'>Date Evaluation:</p>
                                    <p className='headertext mb-2'>Score:</p>
                                    <p className='headertext mb-2'>Position:</p>
                                    <p className='headertext mb-2'>Evaluator Name:</p>
                                </Col>
                                <Col className='col-7'>
                                    <p className='mb-2'>{Employee.crew_nameen}</p>
                                    <p className='mb-2'>{Employee.evaluation_created_at}</p>
                                    <p className='mb-2'>{Employee.evaluation_totalscore} / 5.0</p>
                                    <p className='mb-2'>{Employee.crew_position}</p>
                                    <p className='mb-2'>{Employee.evaluator_name}</p>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                    <Row className='mt-3 midpoint'>
                        <Col md={7}>
                            <Select options={Part} styles={customStylesPart} isSearchable={false} onChange={partonchange} value={{ label: SelectedPart, value: SelectedPartID }} placeholder='Select Your Parts' />
                        </Col>
                        <Col md={7} className='mt-3'>
                            <Table className='tables'>
                                <thead>
                                    <tr>
                                        <th colSpan={3} style={{textAlign: 'left'}}>{SelectedPart}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Eval && Eval.filter(data => data.part_id === SelectedPartID).map((data, index) => {
                                        if (data.evaluation_question_section === 'one') {
                                            // ข้อความตัวหน้า: รวม cell 1,2 เป็นข้อความ, cell 3 = select+ปุ่ม
                                            return (
                                                <tr key={data.evaluation_question_id}>
                                                    <td colSpan={2} style={{fontWeight: 700, fontSize: 16, whiteSpace: EvalGroupResult && EvalGroupResult[data.evaluation_question_id].comment !== '-' ? 'normal' : 'nowrap', maxWidth: '40vw'}}>
                                                        {data.evaluation_question_text}
                                                    </td>
                                                    <td className='columnthrees'>
                                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                            <span style={{fontSize: '14px'}}>
                                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                                    <span style={{fontWeight: '700'}}>Score: {EvalGroupResult ? (EvalGroupResult[data.evaluation_question_id].weight * EvalGroupResult[data.evaluation_question_id].score).toFixed(1) : '0.0'}</span>
                                                                    {EvalGroupResult && EvalGroupResult[data.evaluation_question_id].comment !== '-' ? (
                                                                        <Button variant='warning' size='sm' style={{ marginLeft: '5px', fontWeight: 600, borderRadius: '12px', minWidth: '70px', fontSize: '12px' }} onClick={() => CommentEval(data.evaluation_question_group, EvalGroupResult[data.evaluation_question_id].comment)}>Comment</Button>
                                                                    ): null}
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            // รายการย่อย: cell 1 = checkbox/ว่าง, cell 2+3 รวมกัน = ข้อความ
                                            return (
                                                <tr key={index + 1}>
                                                    <td style={{textAlign: 'center', verticalAlign: 'middle', width: 40}}>
                                                        {data.evaluation_question_section === 'two' && EvalGroupItem && EvalGroupItem[data.evaluation_question_id]?.check ? <BsCheckLg /> : null}
                                                    </td>
                                                    <td colSpan={2} style={{fontSize: 14, fontWeight: 400}}>
                                                        {data.evaluation_question_section === 'three' ? (
                                                            <span className='dot'>•</span>
                                                        ) : null}
                                                        {data.evaluation_question_text}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                    {Eval && Eval.filter(data => data.part_id === SelectedPartID).length > 0 ? (
                                        <tr>
                                            <td colSpan={3} style={{textAlign: 'right', fontWeight: 700}}>
                                                <span>Total : {Employee.score}</span>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan={3} style={{textAlign: 'center', fontWeight: 700}}>
                                                <span>There are no questions for evaluation in this part.</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                        </Table>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Modalviewcomment showModal={showModal} handleCloseModal={handleCloseModal} selectedGroup={selectedGroup} commentText={commentText} disableds={false} />
            <Footer />
        </Container>
    )
}

export default Result;