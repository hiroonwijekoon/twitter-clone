resource "aws_elasticache_cluster" "redis_cluster" {
  cluster_id           = "intern-hiroon-tclone-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis3.2"
  engine_version       = "3.2.10"
  port                 = 6379
  subnet_group_name    = module.vpc.elasticache_subnet_group_name
  security_group_ids   = [module.ecache_sg.security_group_id]
}