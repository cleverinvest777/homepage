
'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <button onClick={() => router.back()} style={styles.backButton}>
        <span style={styles.backText}>← 돌아가기</span>
      </button>

      <div style={styles.content}>
        <h1 style={styles.title}>개인정보처리방침</h1>

        <h2 style={styles.article}>1. 개인정보의 처리 목적</h2>
        <p style={styles.body}>
          회사는 다음의 목적을 위해 개인정보를 처리하며, 해당 목적 외 용도로는 사용하지 않습니다.
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <strong style={styles.listTitle}>회원가입 및 관리</strong>
            <br />회원 식별, 본인확인, 계정 관리, 부정이용 방지
          </li>
          <li style={styles.listItem}>
            <strong style={styles.listTitle}>서비스 제공</strong>
            <br />주식 정보, AI 분석, 콘텐츠 제공, 맞춤형 서비스 제공
          </li>
          <li style={styles.listItem}>
            <strong style={styles.listTitle}>고객 응대 및 분쟁 처리</strong>
            <br />문의 대응, 민원 처리
          </li>
          <li style={styles.listItem}>
            <strong style={styles.listTitle}>마케팅 및 서비스 개선</strong>
            <br />신규 서비스 개발, 이벤트 및 광고 제공 (별도 동의 시)
          </li>
        </ul>

        <h2 style={styles.article}>2. 수집하는 개인정보 항목 및 방법</h2>
        <h3 style={styles.subTitle}>1) 수집 항목</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>필수: 휴대폰번호, 로그인ID, 비밀번호</li>
          <li style={styles.listItem}>선택: 닉네임, 이메일</li>
        </ul>
        <h3 style={styles.subTitle}>2) 자동 수집 정보</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>IP 주소, 기기정보, 앱 이용 기록</li>
          <li style={styles.listItem}>접속 로그, 클릭 로그, 이용 패턴</li>
        </ul>
        <h3 style={styles.subTitle}>3) 수집 방법</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>회원가입 및 서비스 이용 과정</li>
          <li style={styles.listItem}>고객 문의 및 이벤트 참여</li>
        </ul>

        <h2 style={styles.article}>3. 행태정보 수집 및 이용</h2>
        <p style={styles.body}>
          회사는 서비스 이용 과정에서 다음과 같은 정보를 자동으로 수집할 수 있습니다.
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>수집 항목: 조회 종목, 클릭 내역, 서비스 이용 패턴</li>
          <li style={styles.listItem}>이용 목적: 맞춤형 콘텐츠 제공, 서비스 개선, 맞춤형 광고 제공</li>
          <li style={styles.listItem}>거부 방법: 기기 설정에서 광고 식별자 제한 / 앱 설정에서 개인화 서비스 비활성화</li>
        </ul>
        <p style={styles.note}>※ 거부 시 일부 서비스 이용이 제한될 수 있습니다.</p>

        <h2 style={styles.article}>4. 개인정보 보유 및 이용기간</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>회원 탈퇴 시까지</li>
          <li style={styles.listItem}>관련 법령에 따른 보관기간</li>
        </ul>
        <p style={styles.body}>
          계약/결제 기록 — 5년<br />
          소비자 분쟁 기록 — 3년<br />
          접속 로그 — 3개월
        </p>

        <h2 style={styles.article}>5. 개인정보의 파기</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>목적 달성 시 즉시 파기</li>
          <li style={styles.listItem}>전자파일: 복구 불가 방식 삭제</li>
          <li style={styles.listItem}>종이 문서: 분쇄 또는 소각</li>
        </ul>

        <h2 style={styles.article}>6. 이용자의 권리</h2>
        <p style={styles.body}>이용자는 언제든지 다음을 요청할 수 있습니다.</p>
        <ul style={styles.list}>
          <li style={styles.listItem}>개인정보 열람</li>
          <li style={styles.listItem}>수정</li>
          <li style={styles.listItem}>삭제</li>
          <li style={styles.listItem}>처리 정지</li>
        </ul>

        <h2 style={styles.article}>7. 개인정보의 안전성 확보</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>암호화 저장</li>
          <li style={styles.listItem}>접근 권한 최소화</li>
          <li style={styles.listItem}>보안 시스템 운영</li>
          <li style={styles.listItem}>해킹 방지 시스템 구축</li>
        </ul>

        <h2 style={styles.article}>8. 개인정보 처리 위탁</h2>
        <p style={styles.body}>
          회사는 서비스 제공을 위해 일부 업무를 위탁할 수 있습니다.
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>결제 처리</li>
          <li style={styles.listItem}>본인 인증</li>
          <li style={styles.listItem}>알림 발송</li>
        </ul>
        <p style={styles.note}>※ 위탁 시 관련 법령에 따라 관리·감독합니다.</p>

        <h2 style={styles.article}>9. 개인정보의 제3자 제공</h2>
        <p style={styles.body}>
          회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          <br /><br />
          다만, 리워드 지급(기프티콘 발송 등) 서비스 이용 시, 회원의 요청에 따라 아래와 같이 개인정보가 제3자에게 제공될 수 있으며, 이 경우 별도의 동의를 받은 후 제공합니다.
        </p>
        <div style={styles.infoBox}>
          <p style={styles.infoBoxTitle}>▶ 리워드 제공 시 제3자 제공 안내</p>
          <p style={styles.infoBoxBody}>
            제공받는 자: 쿠프마케팅<br />
            제공 항목: 휴대폰번호, 닉네임<br />
            제공 목적: 모바일 쿠폰(기프티콘) 발송<br />
            보유 및 이용 기간: 목적 달성 시까지
          </p>
        </div>
        <p style={styles.body}>
          ※ 회원은 해당 동의를 거부할 수 있으며, 거부 시 리워드 지급이 제한될 수 있습니다.
          <br /><br />
          ▶ 법령에 의한 제공<br />
          단, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우 등은 예외로 합니다.
        </p>

        <h2 style={styles.article}>10. 국외 이전</h2>
        <p style={styles.body}>
          회사는 서비스 운영 및 분석을 위해 일부 데이터를 국외로 이전할 수 있습니다.
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>이전 국가: 미국, 일본 등 (클라우드 서비스 제공 지역)</li>
          <li style={styles.listItem}>이전 대상: Google, AWS, Firebase 등 클라우드 및 분석 서비스 제공자</li>
          <li style={styles.listItem}>이전 항목: 접속 로그, 이용 기록, 기기정보 등</li>
          <li style={styles.listItem}>이전 방법: 서비스 이용 시 네트워크를 통한 수시 전송</li>
          <li style={styles.listItem}>이용 목적: 서비스 운영 및 품질 개선, 데이터 분석</li>
          <li style={styles.listItem}>보유 기간: 회원 탈퇴 시 또는 서비스 종료 시까지</li>
        </ul>

        <h2 style={styles.article}>11. 아동의 개인정보 보호</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>회사는 만 14세 미만 아동의 회원가입을 제한합니다.</li>
          <li style={styles.listItem}>부득이하게 수집 시 법정대리인의 동의를 받습니다.</li>
        </ul>

        <h2 style={styles.article}>12. 휴면 계정 정책</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>1년 이상 미이용 시 휴면 계정으로 전환됩니다.</li>
          <li style={styles.listItem}>개인정보는 분리 보관 또는 파기됩니다.</li>
        </ul>

        <h2 style={styles.article}>13. 개인정보 보호책임자 및 담당부서</h2>
        <div style={styles.infoBox}>
          <p style={styles.infoBoxTitle}>▶ 개인정보 보호책임자</p>
          <p style={styles.infoBoxBody}>
            책임자: 김태환<br />
            이메일: sumelian@naver.com
          </p>
        </div>
        <div style={{ ...styles.infoBox, marginTop: 8 }}>
          <p style={styles.infoBoxTitle}>▶ 개인정보 열람청구 접수·처리 부서</p>
          <p style={styles.infoBoxBody}>부서명: 고객관리팀</p>
        </div>
        <p style={{ ...styles.body, marginTop: 10 }}>
          이용자는 개인정보 관련 문의, 열람청구, 민원 등을 위 부서를 통해 요청할 수 있으며, 회사는 이에 대해 지체 없이 조치합니다.
        </p>

        <h2 style={styles.article}>14. 개인정보 처리방침 변경</h2>
        <p style={styles.body}>
          본 방침은 법령 및 서비스 변경에 따라 수정될 수 있으며, 변경 시 최소 7일 전 공지합니다.
        </p>

        <h2 style={styles.article}>15. 이용약관과의 관계</h2>
        <p style={styles.body}>
          본 개인정보처리방침은 「나도주식전문가 이용약관」과 함께 적용됩니다.<br />
          이용약관과 본 방침의 내용이 상충되는 경우, 개인정보 보호와 관련된 사항은 본 방침을 우선 적용합니다.
        </p>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#FFF',
    fontFamily: 'sans-serif',
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '16px 24px',
    display: 'block',
  },
  backText: {
    color: '#D4AF37',
    fontSize: 14,
  },
  content: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '0 24px 40px',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 28,
  },
  article: {
    fontSize: 14,
    fontWeight: 800,
    color: '#D4AF37',
    marginTop: 24,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#FFF',
    marginTop: 10,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: '#CCC',
    lineHeight: '22px',
    margin: 0,
  },
  note: {
    fontSize: 13,
    color: '#CCC',
    lineHeight: '22px',
    margin: '6px 0 0',
  },
  list: {
    paddingLeft: 18,
    margin: '6px 0',
    color: '#CCC',
    fontSize: 13,
    lineHeight: '22px',
  },
  listItem: {
    marginBottom: 4,
  },
  listTitle: {
    color: '#FFF',
    fontWeight: 600,
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    border: '1px solid #333',
    padding: 14,
    marginTop: 10,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#D4AF37',
    marginBottom: 8,
    marginTop: 0,
  },
  infoBoxBody: {
    fontSize: 13,
    color: '#CCC',
    lineHeight: '22px',
    margin: 0,
  },
};