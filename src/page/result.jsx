import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import { BsCheckLg } from 'react-icons/bs';

import { loading } from './component/sweetalerttwo';
import { customStylesPart } from '../css/styles';
import Navbars from './component/navbar/navbarback';
import Footer from './component/footer';
import { get_part, get_evaluation, get_result_evaluation_group, get_result_evaluation_item } from './component/connectdatabase';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // โหลดข้อมูลเมื่อเริ่มต้น
    const [Employee, setEmployee] = useState({});
    const [Comment, setComment] = useState('-');
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
        const result_comment = results.filter(item => item.evaluation_question_section === 'one').reduce((acc, data) => {
            acc[data.evaluation_question_group] = data.evaluation_question_id;
            return acc;
        }, {});
        setComment(result_comment);
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
                                    <p className='mb-2'>{(Employee?.evaluation_totalscore ?? 0).toFixed(1)} / 5.0</p>
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
                                    {Eval && Eval.filter(data => data.part_id === SelectedPartID).map((data, index, arr) => {
                                        const isLastInGroup = index === arr.length - 1 || arr[index + 1].evaluation_question_group !== data.evaluation_question_group;
                                        if (data.evaluation_question_section === 'one') {
                                            // ข้อความตัวหน้า: รวม cell 1,2 เป็นข้อความ, cell 3 = select+ปุ่ม
                                            return (
                                                <tr key={data.evaluation_question_id}>
                                                    <td colSpan={2} style={{fontWeight: 700, fontSize: 16, backgroundColor: '#dcdcdc', whiteSpace: EvalGroupResult && EvalGroupResult[data.evaluation_question_id].comment !== '-' ? 'normal' : 'nowrap', maxWidth: '40vw'}}>
                                                        {data.evaluation_question_text}
                                                    </td>
                                                    <td className='columnthrees' style={{backgroundColor: '#dcdcdc'}}>
                                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                            <span style={{fontSize: '14px'}}>
                                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                                    <span style={{fontWeight: '700'}}>Score: {EvalGroupResult ? (EvalGroupResult[data.evaluation_question_id].weight * EvalGroupResult[data.evaluation_question_id].score).toFixed(1) : '0.0'}</span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            // รายการย่อย: cell 1 = checkbox/ว่าง, cell 2+3 รวมกัน = ข้อความ
                                            return (
                                                <React.Fragment key={index + 1}>
                                                    <tr>
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
                                                    {isLastInGroup && (
                                                        <tr>
                                                            <td colSpan={3} style={{height: '100px', fontWeight: 700, fontSize: 14, fontStyle: 'italic'}}>Comment : {Comment && EvalGroupResult ? EvalGroupResult[Comment[data.evaluation_question_group]].comment : '-'}</td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        }
                                    })}
                                    {Eval && Eval.filter(data => data.part_id === SelectedPartID).length > 0 ? (
                                        (() => {
                                            const sectionOneQuestions = Eval.filter(data => data.part_id === SelectedPartID && data.evaluation_question_section === 'one'); // ดึงคำถามเฉพาะ section 'one' ของ part นี้
                                            const count = sectionOneQuestions.length; // จำนวนคำถามที่ใช้คำนวณ
                                            const totalScore = sectionOneQuestions.reduce((sum, data) => { // รวมคะแนนแบบ (weight * score)
                                                const result = EvalGroupResult?.[data.evaluation_question_id];
                                                if (result) {
                                                    return sum + (result.weight * result.score);
                                                }
                                                return sum;
                                            }, 0);
                                            const average = count > 0 ? (totalScore / count) : 0; // คำนวณค่าเฉลี่ย (Sub-Total)
                                            return (
                                                <tr>
                                                    <td colSpan={2} style={{fontWeight: 700}}>
                                                        <span>Sub-Total : {average.toFixed(1)}</span>
                                                    </td>
                                                    <td colSpan={1} style={{textAlign: 'right', fontWeight: 700}}>
                                                        <span>Total : {Employee.evaluation_totalscore.toFixed(1)}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })()
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
            <Footer />
        </Container>
    )
}

export default Result;