import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Modalviewcomment = (item) => {
    const { showModal, handleCloseModal, selectedGroup, commentText } = item;
    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Comment for Group: {selectedGroup}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId='commentText'>
                        <Form.Control as='textarea' rows={3} value={commentText} readOnly={true} placeholder='Enter your comment here...' />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className='midpoint'>
                <Button variant='warning' style={{width: '100px'}} onClick={handleCloseModal}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Modalviewcomment;
