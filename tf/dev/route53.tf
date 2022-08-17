resource "aws_route53_record" "route53_record" {
  zone_id = "Z1HCSX5F3LI1KR"
  name    = "hiroonwijekoon.intern.aws.prd.demodesu.com"
  type    = "A"

  alias {
    name                   = module.alb.lb_dns_name
    zone_id                = module.alb.lb_zone_id
    evaluate_target_health = true
  }
}

module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "4.0.1"

  domain_name = "hiroonwijekoon.intern.aws.prd.demodesu.com"
  zone_id     = "Z1HCSX5F3LI1KR"

  wait_for_validation = true
}