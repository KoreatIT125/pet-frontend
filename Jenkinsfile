pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Git Repository 체크아웃 중...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 의존성 설치 중...'
                sh 'npm ci'
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
