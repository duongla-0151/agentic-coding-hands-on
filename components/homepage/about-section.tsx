import Image from "next/image";

const PARAGRAPHS = [
  `Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là "problem-solver" — chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.`,
  `Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần dào sức đề bút từ trong kỷ nguyên AI, "Root Further" đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.`,
  `Vượt ra khỏi nét giống bề mặt, "Root Further" chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng "địa chất" sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn chảy bóng của người Sun*. Muốn hình ảnh bộ rễ hiểu đặm sâu vào lòng đất, mỗi lần qua từng lớp "trầm tích" để thấm thấu những gì tinh tuý nhất, người Sun* cũng đang "hấp thụ" dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mỗi ngày, mở rộng năng lực và mạnh mẽ "bén rễ" vào kỷ nguyên AI — một tầng "địa chất" hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.`,
];

const PARAGRAPHS_2 = [
  `Trước giông bão, chỉ những tàn cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thước của thời cuộc. Không đơn thuần là tên gọi của chương trình trao giải, "Root Further" còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin tưởng vào bản thân, đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa năng và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.`,
  `Không thể biết trước ai sẽ dẫn đầu trong ngành công nghệ và thị trường hiện đại còn biết bao tầng "địa chất" bí ẩn. Chỉ biết rằng khi "Root Further" đã trở thành tinh thần cốt rễ, chúng ta sẽ không sợ hãi, mà không ngừng hướng về phía trước bất cứ vững nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.`,
];

export function AboutSection() {
  return (
    <section
      id="about-detail"
      style={{ background: "#00101A", padding: "0 144px 80px" }}
    >
      {/* Heading */}
      <div className="mb-10">
        <h2 className="leading-none flex flex-col gap-2 items-start">
          <Image
            src="/images/awards/root-text.png"
            alt="ROOT"
            width={340}
            height={121}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
          <Image
            src="/images/awards/further-text.png"
            alt="FURTHER"
            width={440}
            height={102}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
        </h2>
      </div>

      {/* First set of paragraphs */}
      <div className="flex flex-col gap-5 mb-10">
        {PARAGRAPHS.map((text, i) => (
          <p
            key={i}
            className="text-white/70 leading-relaxed"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            {text}
          </p>
        ))}
      </div>

      {/* Quote block */}
      <blockquote
        className="text-center my-12"
        style={{ borderLeft: "none" }}
      >
        <p
          className="text-white font-bold italic mb-3"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(16px, 1.5vw, 20px)",
          }}
        >
          &ldquo;A tree with deep roots fears no storm&rdquo;
        </p>
        <cite
          className="not-italic"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "13px",
            color: "#FFEA9E",
            opacity: 0.8,
          }}
        >
          Cây sâu bén rễ, bão giông chẳng nề — Ngạn ngữ Anh
        </cite>
      </blockquote>

      {/* Second set of paragraphs */}
      <div className="flex flex-col gap-5">
        {PARAGRAPHS_2.map((text, i) => (
          <p
            key={i}
            className="text-white/70 leading-relaxed"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
