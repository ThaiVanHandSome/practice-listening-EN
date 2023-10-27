from bardapi import Bard
import os
os.environ["_BARD_API_KEY"] = "bAi0OES9Ek_F7kRT5fu8XjVkuOvkU7k0EtxeaYCVSYiykpgRvVHJ5TVJ3OapzXIQs26w4Q."
message = "Tôi có một đoạn văn bản, bạn có thể làm một bài trắc nghiệm về nó không\nCrawler lấy dữ liệu bài viết từ VNExpress, webtretho, bao gồm: Tựa đề, nội dung, url bài viết, thời gian đăng, lưu xuống database. Crawler này sẽ chạy mỗi 60 phút. (Tìm hiểu về cron hoặc recurring task) RESTful API, cho phép người dùng lấy thông tin các bài viết đã có trong database dưới dạng JSON. API này cho phép search, filtering, paging. Có thể dùng bất kì framework nào (Express, Hapi, ASP.NET MVC) tùy thích. Bonus: Tìm cách deploy dự án này lên heroku hoặc now.sh cho bạn bè dùng thử. Nhớ thêm swageer để người dùng biết cách gọi API nha."
print(Bard().get_answer(message))
