module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.resource_prefix}-vpc"
  cidr = "10.0.0.0/16"

  azs = ["ap-northeast-1a", "ap-northeast-1c"]

  public_subnets = ["10.0.100.0/24", "10.0.102.0/24"]

  elasticache_subnets = ["10.0.101.0/24"]
}
