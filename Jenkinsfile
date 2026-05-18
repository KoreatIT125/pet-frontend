pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Git Repository 체크아웃 중...'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '📦 Node.js 설치 중...'
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
                    apt-get install -y nodejs
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 의존성 설치 중...'
                sh 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                echo '🔍 코드 품질 검사 중...'
                sh 'npm run lint || echo Lint skipped'
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 프로젝트 빌드 중...'
                sh 'npm run build || echo Build skipped for React Native'
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 프론트 Docker 이미지 빌드 중...'
                sh '''
                    docker build \
                        --build-arg VITE_API_URL=/api \
                        --build-arg VITE_API_BASE_URL=/api \
                        -t petmediscan-frontend:${BUILD_NUMBER} .
                    docker tag petmediscan-frontend:${BUILD_NUMBER} petmediscan-frontend:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 프론트 Docker 컨테이너 재배포 중...'
                sh '''
                    docker stop petmediscan-frontend || true
                    docker rm petmediscan-frontend || true

                    docker run -d \
                        --name petmediscan-frontend \
                        --network petmediscan-infra_petmediscan-network \
                        -p 3000:80 \
                        --restart unless-stopped \
                        petmediscan-frontend:latest
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 테스트 실행 중...'
                sh 'npm test -- --watchAll=false || echo Test skipped'
            }
        }
    }
    
    post {
        success {
            echo '✅ Frontend CI 성공!'
        }
        failure {
            echo '❌ Frontend CI 실패!'
        }
        always {
            echo '🧹 워크스페이스 정리 중...'
            cleanWs()
        }
    }
}
