﻿namespace BlogSite.Api.Models
{
    public class BlogDislike
    {
        public int BlogId { get; set; }
        public Blog Blog { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}