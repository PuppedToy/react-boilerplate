pipeline {
    agent any
    parameters {
        string(name: 'PM2_PREV_JOB_NAME', defaultValue: 'React Rocket Boilerplate', description: 'Previous pm2 job. It is needed to make it stop')
        string(name: 'PM2_JOB_NAME', defaultValue: 'React Rocket Boilerplate')
    }
    stages {
        stage('setup') {
            steps {
                sh "pm2 stop \"${params.PM2_PREV_JOB_NAME}\" || true"
                sh "npm install"
            }
        }
        stage('test') {
            steps {
                gitStatusWrapper(credentialsId: 'github-token', gitHubContext: 'Status', description: 'Validating') {
                    sh "npm test"
                }
            }
        }
        stage('build') {
            steps {
                sh "npm run build"
            }
        }
        stage('run') {
            steps {
                sh "pm2 start npm --name \"${params.PM2_JOB_NAME}\" -- run start:prod"
            }
        }
    }
}
