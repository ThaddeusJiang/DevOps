# 使用 k8s 部署一个 mango-express + mongo-db

- 2 Deployments / Pods
- 2 Services
- 1 Secret
- 1 ConfigMap

video: https://www.youtube.com/watch?v=EQNO_kM96Mo

### kubectl apply commands in order

    kubectl apply -f mongo-secret.yaml
    kubectl apply -f mongo.yaml
    kubectl apply -f mongo-configmap.yaml
    kubectl apply -f mongo-express.yaml

### give a URL to external service in minikube

    minikube service mongo-express-service