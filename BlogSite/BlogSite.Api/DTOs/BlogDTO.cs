namespace BlogSite.Api.DTOs
{
    public class BlogDTO
    {
        public class BlogDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Content { get; set; }
            public ICollection<CommentSimpleDto> Comments { get; set; }
        }

        public class CommentSimpleDto
        {
            public int Id { get; set; }
            public string Content { get; set; }
            public int UserId { get; set; }
        }
    }
}
