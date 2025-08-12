import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';

// นำเข้ามาจาก Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import { customStylesRating } from '../css/styles';

import Navbars from './component/navbar/navbarback';
import Footer from './component/footer';
import { get_part, get_evaluation, save_evaluation } from './component/connectdatabase';
import { loading, alertquestion, alertsmall, alertsuccessredirect } from './component/sweetalerttwo';
import Modalcomment from './component/modal/modalcomment'; 

const Evaluates = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('tokens');
    const decoded = jwtDecode(token);

    // ข้อมูลใน Select
    const Options_UserType = [{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }];
    
    // โหลดข้อมูลเมื่อเริ่มต้น
    const [Employee, setEmployee] = useState({});
    useEffect(() => {
        document.title = 'Crew Evaluation';
        if (!location.state) {
            return navigate(-1);
        }
        setEmployee({ id: location.state.crew_id, nokid: location.state.crew_code, name: location.state.crew_nameen, position: location.state.crew_position });
        get_database();
    }, []);

    // ดึวข้อมูลจากฐานข้อมูลออกมา
    const [Part, setPart] = useState('');
    const [SelectedPartID, setSelectedPartID] = useState(null);
    const [SelectedPart, setSelectedPart] = useState(null);
    const [Eval, setEval] = useState('');
    const get_database = async () => {
        const result_part = await get_part();
        const results = await get_evaluation();
        let partfilter, evlfilter;
        if (location.state.crew_level === 'level_1') {
            partfilter = await result_part.filter(item => item.part_no !== 'part4');
            evlfilter = await results.filter(item => item.part_id !== 4);
        } else {
            partfilter = result_part;
            evlfilter = results;
        }
        setSelectedPartID(partfilter[0].part_id);
        setSelectedPart(partfilter[0].part_name);
        const options = partfilter.map(part => ({
            value: part.part_id,
            label: part.part_name,
            partno: part.part_no.replace(/([a-zA-Z]+)(\d+)/, '$1 $2').replace(/^./, c => c.toUpperCase())
        }));
        setPart(options);
        setEval(evlfilter);
    }

    // ทุกครั้งที่กด
    const [checked, setChecked] = useState({});
    const handleChange = (evaluation_question_id) => {
        setChecked((prev) => ({
            ...prev,
            [evaluation_question_id]: !prev[evaluation_question_id],
        }));
    };

    // ฟังก์ชันเช็คว่า group นั้นๆ ติ๊กครบหมดมั้ย
    const isGroupAllChecked = (groupName) => {
        const checkboxesInGroup = Eval.filter(
            item => item.evaluation_question_section === 'two' && item.evaluation_question_group === groupName
        );
        // ถ้าไม่มี checkbox เลย return false
        if (!checkboxesInGroup.length) return false;
        return checkboxesInGroup.every(item => checked[item.evaluation_question_id]);
    };

    // รวมว่ามีกลุ่มทั้งหมด
    const getTotalGroups = () => {
        if (!Eval) return 0;
        const uniqueGroups = [...new Set(Eval.map(item => item.evaluation_question_group))];
        return uniqueGroups.length;
    };

    // รวมคะแนนทั้งหมด
    const [groupRatings, setGroupRatings] = useState({});
    const getTotalScore = () => {
        if (!Eval) return 0;
        const uniqueGroups = [...new Set(Eval.map(item => item.evaluation_question_group))];
        let total = 0;
        uniqueGroups.forEach(group => {
            // หาว่า group นี้ ติ๊กถูกครบหรือยัง
            const isChecked = isGroupAllChecked(group);
            if (isChecked && groupRatings[group]?.value) {
                total += groupRatings[group].value;
            }
            // ถ้าไม่ครบ/ไม่ได้เลือกคะแนน จะไม่บวกอะไร (นับเป็น 0)
        });
        return total;
    };

    // Modal and comment functionality
    const [comments, setComments] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [commentText, setCommentText] = useState('');
    const CommentEval = (group) => {
        setSelectedGroup(group);
        setCommentText(comments[group] || '');
        setShowModal(true);
    };
    const handleCommentChange = (e) => setCommentText(e.target.value);
    const handleCloseModal = () => setShowModal(false);

    // เมื่อทำการบันทึก comment
    const SubmitComment = () => {
        setComments(prev => ({
            ...prev,
            [selectedGroup]: commentText || '-'
        }));
        setShowModal(false);
    };

    // ควบคุมปุ่มก่อนหน้าและถัดไป
    const btn_part = (txt) => {
        let number = 0
        if (txt === 'next') {
            number = SelectedPartID + 1;
        } else if (txt === 'prev') {
            number = SelectedPartID - 1;
        }
        const partlast = Part.find(item => item.value === number);
        setSelectedPartID(partlast.value);
        setSelectedPart(partlast.label);
    }

    // กดปุ่มส่งเมื่อทำประเมืืนเสร็ต
    const submit_eval = async () => {
        const uniqueGroups = [...new Set(Eval.map(item => item.evaluation_question_group))];
        // 2. เช็ค group ที่ติ๊กครบแต่ยังไม่ได้เลือกคะแนน (alert)
        let isValid = true;
        let missingRatingGroups = [];
        uniqueGroups.forEach(group => {
            if (isGroupAllChecked(group)) {
                if (!groupRatings[group] || !groupRatings[group].value) {
                    isValid = false;
                    missingRatingGroups.push(group);
                }
            }
        });
        if (!isValid) {
            alertsmall('warning', 'Please select a rating in the group: ' + missingRatingGroups.join(', '));
            return;
        }
        loading();
        // 3. เช็คว่าแต่ละ Part มีการติ๊ก checkbox หรือไม่
        const allParts = [...new Set(Eval.map(item => item.part_id))];
        let missingParts = [];
        allParts.forEach(part => {
            // ตรวจสอบว่า Part ไหนที่ยังไม่มีการติ๊ก
            const partCheckboxIds = Eval.filter(item => item.part_id === part).map(item => item.evaluation_question_id);
            const partChecked = partCheckboxIds.some(id => checked[id]);
            if (!partChecked) {
                // ดึงชื่อ Part มาแสดงใน alert
                const partName = Eval.find(item => item.part_id === part)?.part_name || `Part ${part}`; // ถ้าไม่มีชื่อให้ใช้ชื่อเป็น "Part X"
                missingParts.push(partName); // ถ้าไม่มีการติ๊กใน Part นั้น ๆ ให้เพิ่มไปยัง missingParts
            }
        });
        // ถ้ามี Part ไหนที่ยังไม่ได้ทำ จะขึ้น alert แบบคำถาม
        if (missingParts.length > 0) {
            const confirmResult = await alertquestion(`You haven't evaluated the following parts: ${missingParts.join(', ')}. Would you like to proceed?`);
            if (!confirmResult.isConfirmed) return;
        }
        // 4. เก็บคะแนนแต่ละ group (group ที่ติ๊กครบและเลือกคะแนนเท่านั้น, ไม่ครบเป็น 0)
        const results = uniqueGroups.map(group => {
            let questionid = null;
            let weight = 0;
            let score = 0;
            const questionData = Eval.filter(item => item.evaluation_question_group === group);
            if (isGroupAllChecked(group)) {
                score = groupRatings[group]?.value || 0;
            }
            if (questionData.length > 0) {
                weight = Eval.filter(item => item.evaluation_question_group === group)[0]?.evaluation_question_weight || 0;
                questionid = questionData[0]?.evaluation_question_id || null; // เก็บทุก evaluation_question_id ของ group นี้
            }
            const comment = comments[group] || '-';
            return { group, questionid, weight, score, comment };
        });
        // 5. เก็บสถานะ checkbox ทุกข้อ
        const allCheckStates = Eval.filter(item => item.evaluation_question_section === 'two').map(item => ({ eval_question_id: item.evaluation_question_id, checked: !!checked[item.evaluation_question_id] }));
        // ส่งข้อมูล
        const result = await save_evaluation(Employee.id, decoded.crew_id, SelectedPartID, results, allCheckStates, parseFloat((getTotalScore() / getTotalGroups()).toFixed(1)));
        if (result === 'success') {
            alertsuccessredirect('Evaluation saved successfully.');
        } else {
            alertsmall('error', 'Please contact the system administrator.');
        }
    };


    
    return (
        <Container fluid id='footer'>
            <Navbars />
            <Row style={{flex: 1}}>
                <Col md={12}>
                    <Row className='titles mt-4'>
                        <p>Crew Evaluation</p>
                    </Row>
                    <Row className='mt-2 midpoint'>
                        <div className='card   '>
                            <Row>
                                <Col className='col-4'>
                                    <p className='headertext mb-2'>NokID:</p>
                                    <p className='headertext mb-2'>Name:</p>
                                    <p className='headertext mb-2'>Position:</p>
                                    <p className='headertext mb-3'>Evaluator:</p>
                                </Col>
                                <Col className='col-8'>
                                    <p className='mb-2'>{Employee.nokid}</p>
                                    <p className='mb-2'>{Employee.name}</p>
                                    <p className='mb-2'>{Employee.position}</p>
                                    <p className='mb-2'>{decoded.crew_nameen}</p>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                    <Row className='midpoint'>
                        <Col md={7}>
                            <p style={{textAlign: 'center'}}>Crew Evaluation Progress Bar</p>
                            <ul id='progressbar' className='text-center midpoint'>
                                {Part && Part.map(data => (
                                    <li key={data.value} data-step={data.value} className={`step0 ${SelectedPartID >= data.value ? 'active' : ''} ${SelectedPartID > data.value ? 'success' : ''}`}>
                                        <span className='step-label'>{data.partno}</span>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col md={7}>
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
                                                <tr key={index + 1}>
                                                    <td colSpan={2} style={{fontWeight: 700, fontSize: 16, whiteSpace: isGroupAllChecked(data.evaluation_question_group) ? 'normal' : 'nowrap', maxWidth: '40vw'}}>
                                                        {data.evaluation_question_text}
                                                    </td>
                                                    <td style={{textAlign: 'center', verticalAlign: 'middle', padding: 0}}>
                                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                            <span style={{fontSize: '14px', paddingRight: '10px'}}>
                                                                {isGroupAllChecked(data.evaluation_question_group) ? 
                                                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                                        <Select options={Options_UserType} styles={customStylesRating} className='custom-select' isSearchable={false} value={groupRatings[data.evaluation_question_group] || null} onChange={option => setGroupRatings(prev => ({...prev, [data.evaluation_question_group]: option}))} placeholder='-' />
                                                                        <Button variant='warning' size='sm' className='btncomment' onClick={() => CommentEval(data.evaluation_question_group)}>Comment</Button>
                                                                    </div>
                                                                : 
                                                                    <span style={{fontWeight: '700'}}>Score: 0.0</span>
                                                                }
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
                                                        {data.evaluation_question_section === 'two' ? (
                                                            <input className='form-check-input' type='checkbox' name={data.evaluation_question_group} checked={!!checked[data.evaluation_question_id]} onChange={() => handleChange(data.evaluation_question_id)} />
                                                        ) : null}
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
                                                <span>Total1 : {(getTotalScore() / getTotalGroups()).toFixed(1)}</span>
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
                    <Row>
                        <Col md={12} className='midpoint mb-3'>
                            {SelectedPartID && [
                                SelectedPartID !== 1 && (
                                    <Button key="prev" variant='warning' className='btns' style={{width: '300px'}} onClick={() => btn_part('prev')}>Previous</Button>
                                ),
                                SelectedPartID < Part.length && (
                                    <Button key="next" variant='warning' className='btns' style={{width: '300px'}} onClick={() => btn_part('next')}>Next</Button>
                                ),
                                SelectedPartID === Part.length && (
                                    <Button key="submit" variant='warning' className='btns' style={{width: '300px'}} onClick={submit_eval}>Submit</Button>
                                )
                            ]}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modalcomment showModal={showModal} handleCloseModal={handleCloseModal} selectedGroup={selectedGroup} commentText={commentText} handleCommentChange={handleCommentChange} SubmitComment={SubmitComment} />
            <Footer />
        </Container>
    )
}

export default Evaluates;