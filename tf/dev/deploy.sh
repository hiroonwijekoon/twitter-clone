echo "Enter tag name for the image:"
read tagName
if [ $tagName ]; then
echo "Deploying 1/2 ..."
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 741641693274.dkr.ecr.ap-northeast-1.amazonaws.com
docker tag intern-hiroon-tclone-web-app:latest 741641693274.dkr.ecr.ap-northeast-1.amazonaws.com/intern-hiroon-tclone-web-app:$tagName
docker push 741641693274.dkr.ecr.ap-northeast-1.amazonaws.com/intern-hiroon-tclone-web-app:$tagName
echo "Deploying 2/2 ..."
terraform apply -var imageTagName=$tagName
echo "Deployement Successful!"
else
echo "Invalid tag name. Please re-run the script with a valid tag name. e.g. latest1"
fi
