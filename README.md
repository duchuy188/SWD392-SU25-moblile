TẢI NPM I 
👉  CHẠY BẰNG  npx expo start

✅ Bạn sẽ tạo & viết code ở đâu?
1. app/ – Nơi chính để viết các màn hình
Tất cả các màn hình như trang chủ, chatbot, hướng nghiệp, thông tin liên hệ... bạn sẽ tạo ở đây.

📌 Ví dụ:

bash
Copy
Edit
app/
├── HomeScreen.tsx
├── ChatScreen.tsx
├── SubjectScreen.tsx
├── CareerScreen.tsx
├── ContactScreen.tsx
👉 Mỗi file là một màn hình trong ứng dụng, viết bằng React Native + TypeScript.

2. components/ – Viết các thành phần giao diện tái sử dụng
Khi bạn cần tạo các khối UI dùng lại nhiều lần như nút bấm, ô chat, tiêu đề, khung thẻ...

📌 Ví dụ:

bash
Copy
Edit
components/
├── ChatBubble.tsx      # Bong bóng tin nhắn
├── PrimaryButton.tsx   # Nút chính
├── SubjectCard.tsx     # Thẻ môn học
👉 Import và dùng các component này trong các màn hình ở app/.

3. hooks/ – Viết các logic xử lý
Khi bạn cần xử lý logic như gọi API, lưu lịch sử trò chuyện, xử lý người dùng...

📌 Ví dụ:

bash
Copy
Edit
hooks/
├── useChat.ts          # Hook xử lý chatbot
├── useUser.ts          # Hook quản lý người dùng
👉 Hook sẽ giúp bạn chia sẻ logic sạch sẽ giữa nhiều màn hình hoặc component.

4. constants/ – Khai báo các hằng số
Khi bạn muốn dùng chung màu sắc, font, tên route, API base URL, v.v...

📌 Ví dụ:

bash
Copy
Edit
constants/
├── colors.ts
├── routes.ts
├── config.ts
5. data/ – Lưu dữ liệu mẫu hoặc tĩnh
Khi bạn chưa có backend, bạn có thể tạo các file JSON giả lập dữ liệu như danh sách ngành, môn học,...

📌 Ví dụ:

bash
Copy
Edit
data/
├── careers.json
├── subjects.json
├── faq.json


 