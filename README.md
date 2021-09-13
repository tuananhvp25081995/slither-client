## Cấu trúc thư mục

#   src

*   sprites chứa các thành phần của game ví dụ như nhân vật, thức ăn, đồng hồ, ...

-   CircleBorder.js: Vòng bo
-   Eye.js, EyePair.js: Mắt rắn (Chưa ghép)
-   Leaderboard.js: Bảng xếp hạng (Chưa ghép data)
-   Snake.js: Rắn
-   Timer.js: Đồng hồ đếm ngược
-   Slot.js: Các button hiển thị skill

*   states chứa các màn hình của game ví dụ như menu, play, ...

- Boot.js: Khởi tạo các assets cần thiết cho game. Sau khi khởi tạo xong sẽ chuyển sang màn login
- Login.js: Màn hình đăng nhập chứa input name cho user. Nhập input sẽ chuyển sang màn countdown
- Countdown.js: Nhận data trả về từ server hiển thị thời gian bắt đầu game. Hết thời gian đếm ngược sẽ chuyển vào game
- Game.js: Màn hình game chứa các thành phần của game

* constants: Chứa event socket
* config: Chứa setting của game
* socket: Chứa cấu hình socket
* main.js: Chứa các hàm khởi tạo game