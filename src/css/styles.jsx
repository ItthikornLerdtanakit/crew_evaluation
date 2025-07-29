export const customStylesPart = {
    control: (provided) => ({
        ...provided,
        width: '100%',  // คงความกว้างเดิม
        height: '40px',
        minHeight: '30px',
        fontSize: '14px',
        borderRadius: '10px',
        border: '1px solid #dcdcdc',
        padding: '0 8px',
        display: 'flex',
        alignItems: 'center'
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: '0',
        color: '#aaa',
        marginRight: '0',  // เพิ่มระยะห่างระหว่างข้อความและลูกศร
        fontSize: '10px',  // ลดขนาดไอคอนลง
        backgroundColor: 'transparent',  // ทำให้พื้นหลังโปร่งใส
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '14px',
        padding: '8px',
    }),
};

export const customStylesRating = {
    control: (provided) => ({
        ...provided,
        width: '80px',  // คงความกว้างเดิม
        height: '30px',
        minHeight: '30px',
        fontSize: '14px',
        borderRadius: '30px',
        border: '1px solid #dcdcdc',
        padding: '0 8px',
        display: 'flex',
        alignItems: 'center'
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: '0',
        color: '#aaa',
        marginRight: '0',  // เพิ่มระยะห่างระหว่างข้อความและลูกศร
        fontSize: '10px',  // ลดขนาดไอคอนลง
        backgroundColor: 'transparent',  // ทำให้พื้นหลังโปร่งใส
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '14px',
        padding: '8px',
    }),
};