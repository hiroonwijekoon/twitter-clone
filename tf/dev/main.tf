resource "aws_ecr_repository" "ecr_repository_web_app" {
  name = "${var.resource_prefix}-web-app"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecs_cluster" "aws-ecs-cluster" {
  name = "${var.resource_prefix}-cluster"
}

resource "aws_cloudwatch_log_group" "log-group" {
  name = "${var.resource_prefix}-logs"
}

resource "aws_ecs_task_definition" "aws-ecs-task" {
  family = "${var.resource_prefix}-task"

  container_definitions    = <<DEFINITION
  [
    {
      "name": "intern-hiroon-tclone-web-app",
      "image": "741641693274.dkr.ecr.ap-northeast-1.amazonaws.com/intern-hiroon-tclone-web-app:${var.imageTagName}",
      "entryPoint": [],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${var.resource_prefix}-logs",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "${var.resource_prefix}-web-app"
        }
      },
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ],
      "cpu": 256,
      "memory": 512,
      "networkMode": "awsvpc"
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "512"
  cpu                      = "256"
  execution_role_arn       = "arn:aws:iam::741641693274:role/intern-devops-ecs"
  task_role_arn            = "arn:aws:iam::741641693274:role/intern-devops-ecs"
}

resource "aws_ecs_service" "aws-ecs-service" {
  name                 = "${var.resource_prefix}-ecs-service"
  cluster              = aws_ecs_cluster.aws-ecs-cluster.id
  task_definition      = aws_ecs_task_definition.aws-ecs-task.arn
  launch_type          = "FARGATE"
  scheduling_strategy  = "REPLICA"
  desired_count        = 1
  force_new_deployment = true

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [module.ecs_sg.security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = module.alb.target_group_arns[0]
    container_name   = "intern-hiroon-tclone-web-app"
    container_port   = 80
  }
}