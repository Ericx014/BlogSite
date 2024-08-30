
namespace BlogSite.Api.DTOs
{
    public class UserDTO
    {
        public class UserDto
        {
            public int Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public ICollection<BlogSimpleDto> Blogs { get; set; }
        }

        public class BlogSimpleDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Content { get; set; }
            public ICollection<UserBlogCommentSimpleDto> Comments { get; set; }
        }

        public class UserBlogCommentSimpleDto
        {
            public int Id { get; set; }
            public string Content { get; set; }
            public int CommentorId { get; set; }
            public string CommentorUsername { get; set; }
            public DateTime DateCreated { get; set; }
        }
    }
}
