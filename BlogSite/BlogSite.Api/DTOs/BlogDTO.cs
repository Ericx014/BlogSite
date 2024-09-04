using BlogSite.Api.Models;

namespace BlogSite.Api.DTOs
{
    public class BlogDTO
    {
        public class BlogDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Content { get; set; }
            public User Blogger { get; set; }
            public ICollection<CommentSimpleDto> Comments { get; set; }
            public int Likes { get; set; }
            public int Dislikes { get; set; }
        }

        public class CommentSimpleDto
        {
            public int Id { get; set; }
            public string Content { get; set; }
            public int UserId { get; set; }
            public DateTime DateCreated { get; set; }
        }
    }
}
