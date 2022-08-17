module "load_balancer_sg" {
  source = "terraform-aws-modules/security-group/aws"

  name = "${var.resource_prefix}-lb-sg"

  egress_rules = ["all-all"]

  vpc_id = module.vpc.vpc_id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["http-80-tcp", "https-443-tcp"]

}

module "ecs_sg" {
  source = "terraform-aws-modules/security-group/aws"

  name = "${var.resource_prefix}-ecs-sg"

  egress_rules = ["all-all"]

  vpc_id = module.vpc.vpc_id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["http-80-tcp"]
  security_group_id   = module.load_balancer_sg.security_group_id
}

module "ecache_sg" {
  source = "terraform-aws-modules/security-group/aws"

  name = "${var.resource_prefix}-ecache-sg"

  egress_rules = ["all-all"]

  vpc_id = module.vpc.vpc_id

  ingress_with_source_security_group_id = [
    {
      from_port                = 6379
      to_port                  = 6379
      protocol                 = "tcp"
      source_security_group_id = module.ecs_sg.security_group_id
    }
  ]
}
