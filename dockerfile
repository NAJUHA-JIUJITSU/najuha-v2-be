FROM node:20

WORKDIR /usr/src/app

# wait-for-it.sh 스크립트를 컨테이너에 복사하고 실행 권한 부여
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# 애플리케이션 파일 복사
COPY . /usr/src/app

# 종속성 설치
RUN npm install

# 애플리케이션 시작 명령어 설정
CMD ["sh", "-c", "/usr/src/app/wait-for-it.sh postgres:${DB_PORT} -- /usr/src/app/wait-for-it.sh redis:${REDIS_PORT} -- npm run start:performance"]
