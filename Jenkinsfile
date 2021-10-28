#! /usr/bin/env groovy

node {
    stage('Deploy'){
        gitlabCommitStatus(name: 'Deploy'){
            sh 'docker-compose -f docker-compose.prod.yml stop'
            sh 'docker-compose -f docker-compose.prod.yml up --build -d'
        }
    }
}
