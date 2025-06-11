# Thư mục Scripts

Thư mục này chứa các script tiện ích cho ứng dụng eTrainer. Tất cả các script nên được chạy từ thư mục gốc của dự án.

## Các Script Có Sẵn

### Quản lý Audio
- **`check_audio.cjs`** - Kiểm tra tính toàn vẹn và khả năng truy cập của các file audio
- **`update_audio_local.cjs`** - Cập nhật các file audio cục bộ

### Khởi tạo Dữ liệu
- **`seedListening.cjs`** - Khởi tạo dữ liệu bài tập nghe
- **`seedReading.cjs`** - Khởi tạo dữ liệu bài tập đọc
- **`seed_new_types.cjs`** - Khởi tạo dữ liệu các loại câu hỏi mới

### Quản lý Giai đoạn
- **`update_stages.cjs`** - Cập nhật cấu hình các giai đoạn
- **`update_stages_complete.cjs`** - Hoàn thành quá trình cập nhật giai đoạn
- **`verify_6_stages.cjs`** - Xác minh rằng 6 giai đoạn được cấu hình đúng cách
- **`verify_updated_stages.cjs`** - Xác minh việc cập nhật giai đoạn thành công

### Quản lý Dữ liệu
- **`crawl.cjs`** - Tiện ích thu thập dữ liệu từ web
- **`delete_stage_final_test.cjs`** - Xóa dữ liệu bài kiểm tra cuối của các giai đoạn

## Cách sử dụng

Chạy các script từ thư mục gốc của dự án:

```bash
# Ví dụ
node scripts/check_audio.cjs
node scripts/seedListening.cjs
```

## Lưu ý

Các script này là công cụ tiện ích dành cho mục đích phát triển và bảo trì. Hãy đảm bảo sao lưu dữ liệu của bạn trước khi chạy bất kỳ thao tác phá hủy nào.
