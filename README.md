# LiquorArchive
# Team

김현승

- KAIST 전산학부 21학번
- Front-end

https://github.com/hansnjaren

정태희

- 고려대학교 컴퓨터학과 21학번
- Back-end

https://github.com/JTH011011

# Introduction

Liquor Archive는 내가 마신 술, 가지고 있는 술들을 기록하고 정리할 수 있는 서비스다. 어떤 술을 언제 마셨는지, 어디서 누구랑 마셨는지, 얼마였는지까지 남길 수 있어서 나만의 술 기록장 역할을 한다.

그냥 마시고 끝나는 게 아니라, 모아두고 돌아볼 수 있으니까 하나하나의 순간이 더 특별하게 느껴진다. 술을 좋아하는 사람이라면 누구나 재밌게 쓸 수 있을 거라고 생각한다. 단순한 기록을 넘어서 나만의 술 취향과 히스토리를 만들어가는 게 이 서비스의 가장 큰 매력이다.

# Features

### Home (w/wo Login)

로그인한 상태에서 홈 화면에 들어가면 가장 최근에 술을 구입한 날짜가 뜨며, 어떤 술을 구입했는지 뜬다. 또한 오른쪽에는 최근 30일 간 술을 몇 번 마셨는지 뜬다. 화면을 아래로 내리면 지도에 술을 마신 장소가 표시되며, 마커를 누르면 그 장소에서 몇 번 마셨는지, 그리고 언제 어떤 술을 마셨는지 보인다. 

로그아웃 상태에서는 Login to access data. 문구를 띄워 로그인 및 회원가입을 유도한다. 

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/21fc34eb-d86a-4932-bb19-aa68f5f1aa37" />

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/ed276f61-207b-44e1-a297-6644c9b9d399" />

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/553e2b8b-e7d6-4075-b9d9-619df991160c" />

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/c002dc97-f254-477f-aec0-f7ec7ca13d64" />

### Login/Social-Login]

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/de580835-7c7b-48ae-b420-6000d356258b" />

그렇게 로그인 사이트에 들어가면 위에는 일반 로그인, 밑에는 회원가입 및 구글 로그인 버튼이 있어 다양한 방식으로 로그인할 수 있다.

### SignUp/Social-SignUp

회원가입 버튼을 누르면 일반 회원가입이 되며, 구글로 로그인했으나 가입이 되지 않은 상태일 경우 추가 정보를 입력하고 회원가입을 완료할 수 있는 사이트가 나온다. 

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/a9b6674a-1ace-4091-92a5-787f898e7900" />

<img width="512" height="274" alt="image" src="https://github.com/user-attachments/assets/241b8fd0-a7f3-43bc-9cb0-365599cad194" />

### Purchase List




구매 내역 탭에 들어가면 내가 여태까지 구매했던 술의 기록이 뜬다. 추가 버튼을 누르면 기록을 추가할 수 있으며, 이미 추가한 기록을 누르면 데이터 수정 및 삭제를 할 수 있다. 수정 창은 추가 창과 같은 UI를 사용하되 기존에 입력한 데이터가 뜨게 하여 편의성을 확보했다. 

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/9938a930-9e15-4486-a0d2-5731d655c3ea" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/ed922fc6-7676-468a-9986-3130d1448eea" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/45087b20-aa24-4b48-b7b0-0b26c9d2e5cd" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/0ca9ace3-ed24-4f17-9ac6-2563dc652699" />

### Collections

컬렉션 탭에서는 내가 여태까지 구매했던 술을 모두 확인할 수 있다. 술을 모으는 것이 취미인 사람들을 타겟으로 한 사이트로 구성을 하여 총 구매 병 수 및 최근 구매일이 뜨게 하였다. 사진은 관리자가 추가할 경우 사진이 뜨게 된다. 

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/972beaef-5987-4ac8-946f-23d686aaf340" />

### Log Calendar(Drinking Logs)

여기서는 술을 마신 기록을 추가할 수 있다. 달력에는 술을 마신 날이 점으로 강조되어 표시되며, 그 날짜를 누르면 기록이 뜬다. 

기록을 누르면 기록 수정도 할 수 있으며, 앞선 구매 기록과 같이 같은 UI를 사용하였으며, 홈 화면에 뜨는 장소 정보를 여기서 추가할 수 있다. 이때 카카오맵 API를 이용하여 검색을 통해서 추가할 수 있으며, 한 번에 여러 종류의 술을 마신 경우에도 하나의 기록으로 통합하여 저장할 수 있다. 

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/b8d47201-fbdd-4609-8f56-334697299a26" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/f1828523-1701-42e0-9f95-db7bcda0188e" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/ce1851fd-f821-49e4-b767-a5a42ede0f9e" />

### MyPage(Statistics)

마이페이지에서는 사용자 정보 및 통계를 확인할 수 있다. 회원 정보 수정을 통해 회원 정보를 수정할 수 있으며, 로컬에서 프로필 사진을 업로드할 수도 있다. 

통계 탭에서는 총 구매한 병수 및 음주 일수를 볼 수 있으며 총 음주 기록을 표로 확인할 수 있다. 

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/700cb979-7dea-400d-b8e6-19df64e1ea65" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/cf3652c3-e2d5-400f-9f64-63add11d6348" />

<img width="1024" height="547" alt="image" src="https://github.com/user-attachments/assets/ffca8cd4-302c-41a3-ab93-569b1197093b" />

# Stacks

### **Frontend**

- **Next.js (App Router)** – CSR/SSR 지원, 페이지 구성 최적화
- **TypeScript** – 정적 타입 검사로 안정성 확보
- **Tailwind CSS** – 빠른 UI 스타일링 및 반응형 디자인
- **React Query / SWR** – API 요청 및 캐싱 (선택사항)

### **Backend**

- **Next.js API Routes** – 프론트와 통합된 API 서버
- **TypeScript** – 정적 타입 검사로 안정성 확보
- **Prisma** – 타입 안전한 ORM, PostgreSQL과의 연동
- **PostgreSQL** – 확장성과 안정성을 갖춘 RDB
- **NextAuth.js** – 소셜/일반 로그인 인증 처리

### **DevOps / Deployment**

- **Vercel** – 프론트·백 통합 배포 환경
- **Supabase** – PostgreSQL 호스팅 + 인증/스토리지 제공

### **ETC**

- **Swagger (OpenAPI)** – API 문서 자동화
- **Zod / Yup** – 입력 값 검증

# 영상

https://github.com/user-attachments/assets/33e4abd5-4be3-4a39-bda3-08cd856fcb62
