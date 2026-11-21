# MoMo SafeMate — Bộ mã nguồn

Trợ lý AI hỗ trợ kiểm tra rủi ro trước thanh toán (nhánh Trợ lý thanh toán + chủ đề Chống lừa đảo).
Nhóm: Mai Quỳnh Thy (trưởng nhóm) · Nguyễn Mạnh Trường Thành — MSSV 26661901.
Thời gian dự án: 22/11/2026 – 03/12/2026.

## Bên trong gói này có gì

| File | Nội dung |
| --- | --- |
| `index.html` | Cấu trúc trang web (HTML). File này liên kết tới `style.css` và `script.js` ở cùng thư mục — để cả 3 file chung một folder rồi mở `index.html` bằng trình duyệt là chạy. |
| `style.css` | Toàn bộ CSS của website: màu MoMo, bố cục, giao diện điện thoại, màu 3 mức cảnh báo... |
| `script.js` | Toàn bộ JavaScript: bộ quy tắc phân tích rủi ro, tình huống mẫu, hiển thị báo cáo, tải báo cáo .txt, lịch sử kiểm tra. |
| `backend.cpp` | Backend C++ tham khảo theo đúng kiến trúc ở mục 8 của bản kế hoạch: nhận nội dung giao dịch, trích xuất số tiền, chấm điểm rủi ro theo bộ quy tắc (hối thúc, cọc trước không điều kiện, giá rẻ bất thường, yêu cầu OTP/mật khẩu, lệch số tiền...) và trả kết quả dạng JSON để frontend hiển thị báo cáo. |
| `README.md` | File này. |

## Cách chạy thử

- **Website:** để `index.html`, `style.css`, `script.js` cùng một thư mục, mở `index.html` bằng Chrome/Edge/Firefox (hoặc bấm đúp). Muốn sửa, mở các file bằng VS Code, sửa rồi lưu và tải lại trang.
- **Backend C++:** cần trình biên dịch g++ (MinGW/Dev-C++ trên Windows hoặc g++ trên Linux):

  ```
  g++ -std=c++17 -O2 -o backend backend.cpp
  ./backend "Chuyen coc 500000 ngay trong 10 phut keo het phong" 500000
  ```

  Chương trình in ra JSON gồm `amount_found`, `risk_score`, `level`
  (`TUONG_DOI_RO` / `CAN_XAC_MINH_THEM` / `RUI_RO_CAO`) và danh sách `signals` kèm lý do.

## Muốn sửa thì sửa ở đâu

- **Màu sắc MoMo:** trong `style.css`, tìm biến `--momo: #A50064` ở đầu file.
- **Nội dung chữ:** trong `index.html`, tìm theo tiêu đề section (Hero, Khi nào nên kiểm tra, Cách hoạt động, Dấu hiệu lừa đảo, Tình huống, Hướng dẫn sử dụng, FAQ, Cam kết an toàn...).
- **Bộ quy tắc chấm điểm rủi ro:** trong `script.js`, hàm phân tích giao dịch — các từ khóa (hối thúc, cọc trước, OTP...) và trọng số điểm đều khai báo rõ ràng để chỉnh.
- **Tình huống mẫu:** khai báo dạng danh sách trong `script.js`, thêm/bớt tình huống tại đó.

## Ghi chú trung thực về phạm vi

- Bản web hiện tại chạy hoàn toàn phía trình duyệt: logic phân tích là bộ quy tắc minh bạch chạy bằng JavaScript. Bản chính thức theo kế hoạch sẽ gọi mô hình AI qua API ở backend (C++/Flask), API key chỉ lưu phía máy chủ, không đưa vào frontend.
- Sản phẩm KHÔNG thực hiện chuyển tiền, KHÔNG truy cập tài khoản MoMo/ngân hàng, KHÔNG xác minh danh tính và KHÔNG bảo đảm giao dịch an toàn tuyệt đối. Không bao giờ yêu cầu người dùng nhập mật khẩu, mã OTP hay số thẻ đầy đủ.
