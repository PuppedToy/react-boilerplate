pipeline {
    agent any
    parameters {
        string(name: 'PM2_PREV_JOB_NAME', defaultValue: 'React Rocket Boilerplate', description: 'Previous pm2 job. It is needed to make it stop')
        string(name: 'PM2_JOB_NAME', defaultValue: 'React Rocket Boilerplate')
    }
    stages {
        stage('setup') {
            steps {
                sh 'pm2 stop "${params.PM2_JOB_NAME}"'
                sh 'npm install'
            }
        }
        stage('test') {
            steps {
                sh 'npm test'
            }
        }
        stage('build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('run') {
            steps {
                sh 'pm2 npm --name "${params.PM2_JOB_NAME}" -- run start:prod'
            }
        }
    }
}
