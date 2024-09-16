using BlogSite.Api.Models;
using static BlogSite.Api.DTOs.UserDTO;

namespace BlogSite.Api.DTOs
{
    public class BlogDTO
    {
        public class BlogDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Content { get; set; }
            public UserDto Blogger { get; set; }
            public ICollection<CommentSimpleDto> Comments { get; set; }
            public int LikesCount { get; set; }
            public int DislikesCount { get; set; }
            public List<string> Tags { get; set; }
            public string Category { get; set; }
            public DateTime DateCreated { get; set; }
            public DateTime? DateUpdated { get; set; }
        }

        public class CommentSimpleDto
        {
            public int Id { get; set; }
            public string Content { get; set; }
            public int UserId { get; set; }
            public string User { get; set; }
            public DateTime DateCreated { get; set; }
        }
    }
}
