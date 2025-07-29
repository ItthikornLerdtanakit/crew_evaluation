// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ Sweetalert2
import Swal from 'sweetalert2'

// ป้ายเล็กๆด้านขวาบน
export const alertsmall = (icon, text) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: text
    });
}

// การแจ้งเตือนเมื่อมีการถามว่าจะต้องการทำอะไร
export const alertquestion = async (text) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2',
          cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    });
    return await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Submit',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    });
}

// แจ้งเตือนสำเร็จ พร้อม Redireact
export const alertsuccessredirect = (text, link) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2'
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Succeed!',
        text: text,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => handleRedirect(result, link));
}

const handleRedirect = (result, link) => {
    if (result.isConfirmed) {
        window.location.href = link;
    }
};

export const loading = async (message) => {
    // แสดง Loading Popup
    if (message === '' || message === undefined) {
        Swal.fire({
            title: 'Loading...',
            html: `
              <div class='spinner-border text-warning' role='status' style='width: 5rem; height: 5rem;'>
                <span class='visually-hidden'>Loading...</span>
              </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'custom-loading-popup'
            },
            scrollbarPadding: false,
        });
    }
    // ตรวจสอบข้อความตอบกลับ
    if (message === 'success') {
        // ปิด Popup Loading
        Swal.close();
    }
};

// เมื่อออกจากระบบ
export const alertlogout = (logout) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2',
          cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Log out or not?',
        text: 'Do you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => result.isConfirmed ? logout() : null);
}